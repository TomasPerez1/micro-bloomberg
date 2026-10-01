import Markets from './markets/Markets';

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 900 }}>
      <p style={{ color: '#6b7680', fontSize: 12 }}>remote-markets · standalone :3001</p>
      <Markets />
    </main>
  );
}
