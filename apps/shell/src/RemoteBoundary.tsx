import { Component, Suspense, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  name: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}


export class RemoteBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[shell] el remote "${this.props.name}" falló:`, error, info);
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div style={styles.fallback}>
          <strong>{this.props.name} no está disponible</strong>
          <p style={styles.detail}>{this.state.error.message}</p>
          <button style={styles.retry} onClick={() => this.setState({ error: null })}>
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <Suspense fallback={<p style={styles.loading}>Cargando {this.props.name}…</p>}>
        {this.props.children}
      </Suspense>
    );
  }
}

const styles: Record<string, React.CSSProperties> = {
  fallback: {
    border: '1px dashed #d0a3a6',
    background: '#fdf5f5',
    borderRadius: 8,
    padding: 16,
    color: '#8a2c31',
  },
  detail: { fontSize: 12, margin: '6px 0 10px', opacity: 0.8 },
  retry: {
    fontSize: 12,
    padding: '4px 10px',
    borderRadius: 4,
    border: '1px solid #c98c90',
    background: '#fff',
    cursor: 'pointer',
  },
  loading: { color: '#6b7680' },
};
