/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEADS_SCRIPT_URL?: string;
  readonly VITE_LEADS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
