import { defineConfig } from 'vite';

// Vercel already holds NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY from the previous (Next.js) site,
// so expose that prefix to the client as well and no new env vars are needed.
export default defineConfig({ envPrefix: ['VITE_', 'NEXT_PUBLIC_'] });
