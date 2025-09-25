const getMetaEnv = () => {
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env) {
    return (import.meta as any).env as Record<string, string | undefined>;
  }
  return {};
};

const getProcessEnv = () => {
  const proc = (globalThis as any)?.process;
  if (proc?.env) {
    return proc.env as Record<string, string | undefined>;
  }
  return {};
};

const resolveKeyVariants = (key: string): string[] => {
  const variants = new Set<string>([key]);

  if (key.startsWith('REACT_APP_')) {
    variants.add(key.replace('REACT_APP_', 'VITE_'));
  } else if (key.startsWith('VITE_')) {
    variants.add(key.replace('VITE_', 'REACT_APP_'));
  }

  return Array.from(variants);
};

const lookupEnvValue = (envSource: Record<string, string | undefined>, key: string): string | undefined => {
  for (const variant of resolveKeyVariants(key)) {
    if (variant in envSource && envSource[variant] !== undefined) {
      return envSource[variant];
    }
  }
  return undefined;
};

export const readEnv = (key: string): string | undefined => {
  const metaValue = lookupEnvValue(getMetaEnv(), key);
  if (metaValue !== undefined) {
    return metaValue;
  }

  const nodeValue = lookupEnvValue(getProcessEnv(), key);
  if (nodeValue !== undefined) {
    return nodeValue;
  }

  return undefined;
};

export const requireEnv = (key: string): string => {
  const value = readEnv(key);
  if (value == null || value === '') {
    throw new Error(`Environment variable ${key} is required but was not provided.`);
  }
  return value;
};
