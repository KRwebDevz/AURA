import { registerAs } from '@nestjs/config';
import { AURA_VERSION } from '../kernel/version';
import { CONFIG_KEY } from './constants';
import { validateEnv } from './env.schema';
import { AppConfig } from './types';

export default registerAs(CONFIG_KEY, (): AppConfig => {
  const env = validateEnv(process.env);

  return {
    name: env.AURA_NAME,
    version: AURA_VERSION,
    environment: env.NODE_ENV,
    port: env.PORT,
    logLevel: env.LOG_LEVEL,
    timezone: env.TIMEZONE,
    locale: env.LOCALE,
  };
});
