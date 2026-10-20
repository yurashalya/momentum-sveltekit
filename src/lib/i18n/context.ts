import { createContext } from 'svelte';
import type { Locale } from './index.js';

export const [useLocale, provideLocale] = createContext<() => Locale>();
