import { ILogger } from '../platform/logging/logger.interface';
import { AURA_VERSION } from './version';

export function printStartupBanner(
  logger: ILogger,
  port: number = 3000,
): void {
  const bannerLines = [
    '═══════════════════════════════════════════════',
    '              A U R A',
    'Personal Intelligence Operating System',
    `Version ${AURA_VERSION}`,
    '═══════════════════════════════════════════════',
    'Booting Kernel...',
    '✓ Configuration',
    '✓ Logger',
    '✓ Platform',
    'Kernel Ready',
    `Listening on http://localhost:${port}`,
  ];

  bannerLines.forEach((line) => logger.info(line, 'Bootstrap'));
}
