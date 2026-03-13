import { Response } from 'express';
import prisma from '../../config/db';
import { AuthRequest } from '../../middlewares/authMiddleware';

export const getSchools = async (req: AuthRequest, res: Response) => {
  try {
    const schools = await prisma.school.findMany();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSchool = async (req: AuthRequest, res: Response) => {
  try {
    const { name, subdomain } = req.body;
    
    const newSchool = await prisma.school.create({
      data: { name, subdomain }
    });

    res.status(201).json(newSchool);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
