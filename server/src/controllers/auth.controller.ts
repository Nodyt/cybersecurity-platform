import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, name } = req.body;

        // Check if user exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash,
                role: role || 'STUDENT',
            },
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'REGISTER',
                entity: 'User',
                entityId: user.id,
            }
        });

        res.status(201).json({
            message: 'User created',
            user: { id: user.id, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ error: 'Server error', details: error.message });
        } else {
            res.status(500).json({ error: 'Server error', details: String(error) });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Check password
        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Audit Log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'LOGIN',
                entity: 'User',
                entityId: user.id,
            }
        });

        res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
