interface ImportMetaEnv {
  /** Backend base URL including /api, e.g. http://localhost:5000/api */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
