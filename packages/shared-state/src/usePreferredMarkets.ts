import { useSyncExternalStore } from 'react';
import { getPreferredMarkets, subscribe } from './preferredMarkets';

// Conecta elestado compartido (externo) con react
export function usePreferredMarkets(): string[] {
  return useSyncExternalStore(
    subscribe,
    getPreferredMarkets,
    getPreferredMarkets,
  );
}
