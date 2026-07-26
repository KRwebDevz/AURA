import { PromptRequest } from './prompt.request';

export function formatGroundedSystemPrompt(
  baseSystemPrompt: string,
  request: PromptRequest,
): string {
  const { capability, domain, context } = request;

  const contextBlock = `
[REAL RUNTIME TELEMETRY]
- Kernel State: ${context.kernelState}
- AI Provider: ${context.providerName} (${context.providerStatus})
- Active Model: ${context.activeModel}
- Kernel Uptime: ${context.uptimeSeconds}s
- System Timestamp: ${context.timestamp}
- Classified Intent: [Capability: ${capability}] [Domain: ${domain}]
[END RUNTIME TELEMETRY]
`;

  let intentDirective = '';
  switch (capability) {
    case 'ANALYZE':
      intentDirective = `Direct Capability Instruction: Perform an in-depth, executive analysis focused on the ${domain} domain.`;
      break;
    case 'PLAN':
      intentDirective = `Direct Capability Instruction: Structure a clean, prioritized executive agenda tailored for ${domain}.`;
      break;
    case 'COMMAND':
      intentDirective = `Direct Capability Instruction: Execute the requested operational action concisely with status feedback.`;
      break;
    case 'SEARCH':
      intentDirective = `Direct Capability Instruction: Retrieve and report specific facts relevant to ${domain}.`;
      break;
    case 'CREATE':
      intentDirective = `Direct Capability Instruction: Draft high-quality, executive-grade artifacts for ${domain}.`;
      break;
    default:
      intentDirective = `Direct Capability Instruction: Provide a direct, concise executive response for ${domain}.`;
      break;
  }

  const memoryBlock = request.memoryContext
    ? `\n[MEMORY CONTEXT]\n${request.memoryContext}\n`
    : '';

  const workspaceBlock = request.workspaceContext
    ? `\n[WORKSPACE CONTEXT]\n${request.workspaceContext}\n`
    : '';

  const rulesBlock = request.rules && request.rules.length > 0
    ? `\n[ACTIVE OPERATIONAL RULES]\n${request.rules.map((r) => `- ${r}`).join('\n')}\n`
    : '';

  return `${baseSystemPrompt}\n${contextBlock}${memoryBlock}${workspaceBlock}${rulesBlock}\n${intentDirective}`;
}
