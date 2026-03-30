import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// Auth check directly in the server component
async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin-session')?.value;
  
  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }

  try {
    const sessionData = JSON.parse(Buffer.from(session, 'base64').toString());
    
    if (!sessionData.user || !sessionData.expires || new Date() > new Date(sessionData.expires)) {
      redirect('/login?callbackUrl=/admin');
    }
  } catch {
    redirect('/login?callbackUrl=/admin');
  }
}

export default async function AdminPage() {
  // Auth check on server
  await checkAuth();
  return <AdminClient />;
}

