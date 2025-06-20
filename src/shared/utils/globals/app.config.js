const DEFAULT_BASE = '/';
const DEFAULT_ENV = 'VITE_GITHUB_REPO_NAME';

/**
 * logic for calculate the base
 */
function resolveBasePath(base) {
    const parts = base?.split('/').filter(Boolean);
    const repo = parts?.[1] || parts?.[0]; // fallback si solo hay un valor
    return base || (repo ? `/${repo}/` : DEFAULT_BASE);
}


/**
 * ✅ Client: export from import.meta.env
 */
export const __appBase =
    typeof import.meta !== 'undefined' && import.meta.env?.[DEFAULT_ENV]
        ? resolveBasePath(import.meta.env[DEFAULT_ENV])
        : DEFAULT_BASE;

/**
 * ✅ Server: get an object env (Example. from loadEnv())
 */
export function createAppBase(env) {
    const base = env?.[DEFAULT_ENV] || '';
    return resolveBasePath(base);
}
