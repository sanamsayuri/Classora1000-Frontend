import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify current user is super admin
    const currentUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!currentUser || !currentUser.isSuperAdmin) {
      return NextResponse.json({ error: 'Forbidden. Super Admin only.' }, { status: 403 });
    }

    const { userIdToApprove } = await request.json();

    if (!userIdToApprove) {
      return NextResponse.json({ error: 'Missing userIdToApprove' }, { status: 400 });
    }

    const approvedUser = await prisma.user.update({
      where: { id: userIdToApprove },
      data: { approved: true },
    });

    return NextResponse.json({ user: approvedUser, message: 'User approved successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in POST /api/user/approve:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
