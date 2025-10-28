// Environment variable type declarations
interface ImportMetaEnv {
  VITE_GOOGLE_API_KEY: string;
  VITE_GOOGLE_SHEET_ID: string;
  VITE_GOOGLE_SHEET_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export const getEnvVar = (key: string): string | undefined => {
  const viteKey = `VITE_${key}` as keyof ImportMetaEnv;
  const nextKey = `NEXT_PUBLIC_${key}`;
  
  // Try import.meta.env first (Vite's way)
  if (import.meta.env[viteKey]) {
    return import.meta.env[viteKey];
  }
  
  // Fallback to process.env if available
  if (typeof process !== 'undefined' && process.env && process.env[nextKey]) {
    return process.env[nextKey];
  }
  
  return undefined;
};