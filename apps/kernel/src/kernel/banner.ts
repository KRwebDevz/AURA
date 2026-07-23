import { AURA_VERSION } from './version';

export function printStartupBanner(port: number = 3000): void {
  console.log(`
═══════════════════════════════════════════════

              A U R A

Personal Intelligence Operating System

Version ${AURA_VERSION}

═══════════════════════════════════════════════

Booting Kernel...

✓ Configuration
✓ Logger
✓ Platform

Kernel Ready

Listening on http://localhost:${port}
`);
}
