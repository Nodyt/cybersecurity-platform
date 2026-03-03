import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get random set of 10 simulations for the "Inbox"
router.get('/inbox', authenticateToken, async (req: any, res) => {
    try {
        // Fetch 10 random simulations
        // Note: For true randomness in SQL we might use raw query, but for now take first 20 and shuffle in JS
        const allSimulations = await prisma.simulation.findMany({
            take: 20
        });

        const shuffled = allSimulations.sort(() => 0.5 - Math.random());
        const inbox = shuffled.slice(0, 10);

        res.json(inbox);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inbox' });
    }
});

// Submit a batch of answers (Standard Phishing Drill)
router.post('/submit-drill', authenticateToken, async (req: any, res) => {
    try {
        const { answers } = req.body; // Array of { simulationId, verdict }
        const userId = req.user.userId;
        let correctCount = 0;
        const results = [];

        // Save individual attempts
        for (const ans of answers) {
            const simulation = await prisma.simulation.findUnique({ where: { id: ans.simulationId } });
            if (!simulation) continue;

            const isCorrect = (simulation.isPhishing && ans.verdict === 'PHISHING') ||
                (!simulation.isPhishing && ans.verdict === 'SAFE');

            if (isCorrect) correctCount++;

            await prisma.simulationAttempt.create({
                data: {
                    userId,
                    simulationId: ans.simulationId,
                    verdict: ans.verdict,
                    isCorrect
                }
            });

            results.push({
                simulationId: ans.simulationId,
                isCorrect,
                explanation: simulation.explanation // Only shown if user passed threshold? Logic handled in frontend or here
            });
        }

        // Return detailed results only if passed 8/10
        if (correctCount >= 8) {
            res.json({
                status: 'PASSED',
                score: correctCount,
                total: answers.length,
                details: results
            });
        } else {
            res.json({
                status: 'FAILED',
                score: correctCount,
                total: answers.length,
                details: [] // Hide details on failure as requested
            });
        }

    } catch (error) {
        res.status(500).json({ error: 'Failed to submit drill' });
    }
});

// Get User Statistics for Phishing
router.get('/stats', authenticateToken, async (req: any, res) => {
    try {
        const userId = req.user.userId;

        const attempts = await prisma.simulationAttempt.findMany({
            where: { userId },
            include: { simulation: true }
        });

        const totalAttempts = attempts.length;
        const correctAttempts = attempts.filter(a => a.isCorrect).length;
        const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;

        // Analyze failures by difficulty or type (if we add category later)
        // For now just basic stats
        res.json({
            totalAttempts,
            accuracy: Math.round(accuracy),
            lastDrillDate: attempts.length > 0 ? attempts[attempts.length - 1].createdAt : null
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default router;
