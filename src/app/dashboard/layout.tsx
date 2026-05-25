import Sidebar from '@/components/ui/Sidebar';
import TopBar from '@/components/ui/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        paddingTop: 'var(--topbar-height)',
      }}>
        <TopBar />
        <main style={{
          padding: 'var(--space-xl)',
          position: 'relative',
          zIndex: 1,
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
