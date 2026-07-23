import { z } from 'zod';
import { DEFAULT_CONFIG } from './constants';
import { EnvironmentVariables } from './types';

export const envSchema = z.object({
  AURA_NAME: z.string().default(DEFAULT_CONFIG.AURA_NAME),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default(DEFAULT_CONFIG.NODE_ENV),
  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(DEFAULT_CONFIG.PORT),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default(DEFAULT_CONFIG.LOG_LEVEL),
  TIMEZONE: z.string().default(DEFAULT_CONFIG.TIMEZONE),
  LOCALE: z.string().default(DEFAULT_CONFIG.LOCALE),
});

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
      .join('\n');
    throw new Error(
      `\n❌ Invalid Environment Configuration:\n${formattedErrors}\n`,
    );
  }

  return result.data;
}
