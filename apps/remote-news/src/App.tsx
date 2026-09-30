import News from './news/News';

export function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 900 }}>
      <p style={{ color: '#6b7680', fontSize: 12 }}>remote-news · standalone :3002</p>
      <News markets={['AR', 'BR']} />
    </main>
  );
}
