export default function ExamsPortal() {
  return (
    <div>
      <h1 style={{
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        marginBottom: 'var(--space-xl)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }}>
        <span style={{ color: 'var(--accent-primary)' }}>✎</span> Exam Portal
      </h1>
      <div style={{
        background: 'rgba(20, 22, 30, 0.5)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-xl)',
        color: 'var(--text-secondary)'
      }}>
        <p>Exam portal content coming soon. You can build this out later!</p>
      </div>
    </div>
  );
}
