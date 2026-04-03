import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id, email } = await request.json();

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const isSuperAdmin = email === process.env.SUPER_ADMIN_EMAIL;
      user = await prisma.user.create({
        data: {
          id,
          email,
          approved: isSuperAdmin,
          isSuperAdmin,
        },
      });
    } else if (user.id !== id) {
      // In case they signed up but have a different ID, sync ID from Supabase
      user = await prisma.user.update({
        where: { email },
        data: { id },
      });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/user/create:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
