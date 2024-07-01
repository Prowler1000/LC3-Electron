import { api } from './preload.ts';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    api: typeof api
  }
}

export {};