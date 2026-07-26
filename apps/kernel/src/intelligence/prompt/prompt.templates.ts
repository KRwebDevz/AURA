import { IntelligenceContext } from '../context/context.types';

export function formatGroundedSystemPrompt(
  baseSystemPrompt: string,
  context: IntelligenceContext,
): string {
  const contextBlock = `
[REAL RUNTIME TELEMETRY]
- Kernel State: ${context.kernelState}
- AI Provider: ${context.providerName} (${context.providerStatus})
- Active Model: ${context.activeModel}
- Kernel Uptime: ${context.uptimeSeconds}s
- System Timestamp: ${context.timestamp}
- Detected Intent: ${context.intent}
[END RUNTIME TELEMETRY]
`;

  let intentDirective = '';
  switch (context.intent) {
    case 'SYSTEM_STATUS':
      intentDirective =
        'Direct Intent Instruction: The user is requesting system status. Provide a concise, dignified summary of operational readiness using the telemetry values above.';
      break;
    case 'PLANNING':
      intentDirective =
        'Direct Intent Instruction: The user is discussing schedule or priorities. Provide clear, structured, executive recommendations.';
      break;
    case 'DEVELOPMENT':
      intentDirective =
        'Direct Intent Instruction: The user is discussing code or architecture. Provide precise technical insights.';
      break;
    case 'MEMORY':
      intentDirective =
        'Direct Intent Instruction: Note that persistent memory store is currently standing by.';
      break;
    default:
      intentDirective =
        'Direct Intent Instruction: Provide a direct, concise executive response.';
      break;
  }

  return `${baseSystemPrompt}\n\n${contextBlock}\n${intentDirective}`;
}
