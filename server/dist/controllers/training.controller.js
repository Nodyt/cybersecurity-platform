"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeModule = exports.getModuleDetails = exports.getTrainingStatus = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTrainingStatus = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        // Fetch User and their progress
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                trainingProgress: {
                    include: {
                        module: true
                    }
                }
            }
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Fetch all available modules to see what is missing
        const allModules = await prisma.module.findMany();
        // Calculate stats
        const completedModules = user.trainingProgress.filter(p => p.status === 'COMPLETED').length;
        const totalModules = allModules.length;
        // Fetch Simulations Stats for Risk Calculation
        // We get ALL attempts, group by unique Drill sessions (not easy in simplified DB, so we take the last 10 attempts as a "session")
        // Or simpler: Get the *latest* SimulationAttempt. If user has passed a batch recently.
        // Actually, let's look at the LAST 10 attempts. If accuracy > 80%, we consider the "Drill" passed.
        const recentAttempts = await prisma.simulationAttempt.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        let drillPassed = false;
        let drillAccuracy = 0;
        if (recentAttempts.length >= 8) { // Needs at least 8 attempts to form a valid opinion
            const correctCount = recentAttempts.filter(a => a.isCorrect).length;
            // Calculate accuracy over the last batch (up to 10)
            drillAccuracy = (correctCount / recentAttempts.length) * 100;
            if (drillAccuracy >= 80) {
                drillPassed = true;
            }
        }
        // --- RISK SCORE CALCULATION ---
        // Base Risk: 100
        // - Sum of reduced risk from Modules
        // - 15 Points reduction for Passing Phishing Drill
        let currentRiskScore = 100;
        user.trainingProgress.forEach(p => {
            if (p.status === 'COMPLETED') {
                currentRiskScore -= (p.module.riskReduction || 0);
            }
        });
        if (drillPassed) {
            currentRiskScore -= 15;
        }
        // Clamp to 0-100
        currentRiskScore = Math.max(0, currentRiskScore);
        // --- EXCELLENCE / PROGRESS SCORE ---
        // Changed to reflect percentage of completed modules explicitly as user requested "Starts at 0%, goes to 100%"
        let finalExcellence = 0;
        if (totalModules > 0) {
            finalExcellence = Math.round((completedModules / totalModules) * 100);
        }
        // Map modules with status
        const modulesWithStatus = allModules.map(module => {
            const progress = user.trainingProgress.find(p => p.moduleId === module.id);
            return {
                id: module.id,
                title: module.title,
                description: module.description,
                type: module.type,
                status: progress ? progress.status : 'PENDING',
                attempts: progress ? progress.attempts : 0,
                score: progress ? progress.score : 0,
                completedAt: progress?.completedAt || null
            };
        });
        res.json({
            riskScore: currentRiskScore, // Dynamically calculated now instead of stored in DB
            excellenceScore: finalExcellence,
            completedModules,
            totalModules,
            modules: modulesWithStatus
        });
    }
    catch (error) {
        console.error('Error fetching training status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getTrainingStatus = getTrainingStatus;
const getModuleDetails = async (req, res) => {
    try {
        const moduleId = req.params.moduleId;
        const userId = req.user?.userId;
        const module = await prisma.module.findUnique({
            where: { id: moduleId }
        });
        if (!module) {
            res.status(404).json({ error: 'Module not found' });
            return;
        }
        // Parse quizData if it exists
        const quiz = module.quizData ? JSON.parse(module.quizData) : [];
        res.json({
            ...module,
            quizData: quiz
        });
    }
    catch (error) {
        console.error('Error fetching module details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getModuleDetails = getModuleDetails;
const completeModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { score } = req.body; // Score out of 100
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const module = await prisma.module.findUnique({ where: { id: moduleId } });
        if (!module) {
            res.status(404).json({ error: 'Module not found' });
            return;
        }
        // 1. Fetch current progress or create
        let progress = await prisma.trainingProgress.findUnique({
            where: { userId_moduleId: { userId, moduleId: moduleId } }
        });
        if (!progress) {
            progress = await prisma.trainingProgress.create({
                data: {
                    userId,
                    moduleId: moduleId,
                    attempts: 0,
                    status: 'PENDING'
                }
            });
        }
        const newAttempts = progress.attempts + 1;
        const isPassed = score >= 85;
        // 2. Handle Case: 3rd attempt failed -> RESET ONLY THIS MODULE
        if (!isPassed && newAttempts >= 3) {
            await prisma.trainingProgress.update({
                where: { id: progress.id },
                data: {
                    status: 'PENDING',
                    attempts: 0,
                    score: 0
                }
            });
            res.json({
                status: 'RESET_REQUIRED',
                message: '3 attempts failed. You must review the theory and watch the video again for this module.'
            });
            return;
        }
        // 3. Logic for risk reduction update
        let appliedReduction = 0;
        if (isPassed) {
            // Apply reduction only if it wasn't already completed
            if (progress.status !== 'COMPLETED') {
                // Tolerance: Attempt 1 & 2 = Full Reduction
                // Attempt 3 = 80% Reward (Score penalty of 20%)
                const penaltyMultiplier = newAttempts >= 3 ? 0.8 : 1.0;
                appliedReduction = Math.round((module.riskReduction || 0) * penaltyMultiplier);
            }
            await prisma.trainingProgress.update({
                where: { id: progress.id },
                data: {
                    status: 'COMPLETED',
                    attempts: newAttempts,
                    score: score,
                    completedAt: new Date()
                }
            });
            if (appliedReduction > 0) {
                const user = await prisma.user.findUnique({ where: { id: userId } });
                if (user) {
                    const newRisk = Math.max(0, user.riskScore - appliedReduction);
                    await prisma.user.update({
                        where: { id: userId },
                        data: { riskScore: newRisk }
                    });
                }
            }
            res.json({
                status: 'COMPLETED',
                score,
                attempts: newAttempts,
                appliedReduction,
                message: 'Congratulations! You passed the module.'
            });
        }
        else {
            // Failed attempt
            await prisma.trainingProgress.update({
                where: { id: progress.id },
                data: {
                    status: 'FAILED',
                    attempts: newAttempts,
                    score: score
                }
            });
            res.json({
                status: 'FAILED',
                score,
                attempts: newAttempts,
                message: `You scored ${score}%. You need 85% to pass. You have ${3 - newAttempts} attempts left.`
            });
        }
    }
    catch (error) {
        console.error('Error completing module:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.completeModule = completeModule;
