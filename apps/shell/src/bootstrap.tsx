import { StrictMode } from 'react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import * as sharedState from '@mbg/shared-state';
import { App } from './App';


// todo Delete debug webpack global variable
declare const __webpack_share_scopes__: Record<
  string,
  Record<string, Record<string, unknown>>
>;

// @ts-expect-error debug-only
window.__shareScopes = __webpack_share_scopes__;
// @ts-expect-error debug-only
window.__shellReact = React;
// @ts-expect-error debug-only
window.__shellStore = sharedState;
//todo Delete

const container = document.getElementById('root');
if (!container) throw new Error('No existe #root');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
