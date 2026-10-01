
let markets: string[] = ['AR', 'BR'];

const listeners = new Set<() => void>();


export function getPreferredMarkets(): string[] {
  return markets;
}

export function setPreferredMarkets(next: string[]): void {
  markets = next;
  emit();
}

export function toggleMarket(marketId: string): void {
  markets = markets.includes(marketId)
    ? markets.filter((m) => m !== marketId)
    : [...markets, marketId].sort();
  emit();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit(): void {
  for (const listener of [...listeners]) listener();
}
