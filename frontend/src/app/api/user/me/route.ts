import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prismaUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!prismaUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    return NextResponse.json({ user: prismaUser }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/user/me:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
