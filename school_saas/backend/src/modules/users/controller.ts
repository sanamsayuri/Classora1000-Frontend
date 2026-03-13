import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../config/db';
import { AuthRequest } from '../../middlewares/authMiddleware';

// Fetch users for the current tenant
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { school_id, role } = req.user!;
    
    // Super admin can see all users, others only see users in their school
    const whereClause = role === 'SUPER_ADMIN' ? {} : { school_id };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        role: true,
        school_id: true,
        created_at: true,
        profile: true
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new user (Usually done by Super Admin or School Admin)
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role, school_id, first_name, last_name, phone } = req.body;
    const currentUser = req.user!;

    // Enforce tenant boundary: School Admin cannot create users for other schools
    const finalSchoolId = currentUser.role === 'SUPER_ADMIN' ? school_id : currentUser.school_id;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password_hash,
        role,
        school_id: finalSchoolId,
        profile: {
          create: {
            first_name,
            last_name,
            phone
          }
        }
      },
      select: {
        id: true,
        email: true,
        role: true,
        school_id: true
        // excluding password_hash
      }
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
