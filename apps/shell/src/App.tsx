import { lazy, useState } from 'react';
import { RemoteBoundary } from './RemoteBoundary';

// Async fecth to the remotes
const Markets = lazy(() => import('remoteMarkets/Markets'));
const News = lazy(() => import('remoteNews/News'));

export function App() {
  const [selected] = useState<string[]>(['AR', 'BR']);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.brand}>Market Data Dashboard</h1>
        <span style={styles.badge}>shell · :3000</span>
      </header>

      <div style={styles.grid}>
        <RemoteBoundary name="Markets">
          <Markets />
        </RemoteBoundary>

        <RemoteBoundary name="News">
          <News markets={selected} />
        </RemoteBoundary>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#f4f6f8',
    minHeight: '100vh',
    padding: 24,
  },
  header: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 20,
  },
  brand: { 
    fontSize: 20, 
    margin: 0 
  },
  badge: { 
    fontSize: 11, 
    color: '#6b7680' 
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: 16,
    alignItems: 'start',
  },
};
