import { api } from './preload.cjs';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    api: typeof api
  }
}

