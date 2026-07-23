import { ILifecycleParticipant } from './lifecycle.interface';
import { LifecycleManager } from './lifecycle.manager';
import { LifecycleRegistry } from './lifecycle.registry';
import { LifecycleState } from './lifecycle.types';
import { LoggerManager } from '../logging/logger.manager';

describe('LifecycleManager', () => {
  let registry: LifecycleRegistry;
  let mockLogger: jest.Mocked<LoggerManager>;
  let manager: LifecycleManager;

  beforeEach(() => {
    registry = new LifecycleRegistry();
    mockLogger = {
      setContext: jest.fn().mockReturnThis(),
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    } as unknown as jest.Mocked<LoggerManager>;

    manager = new LifecycleManager(registry, mockLogger);
  });

  it('should start in CREATED state', () => {
    expect(manager.getState()).toBe(LifecycleState.CREATED);
  });

  it('should transition through CREATED -> INITIALIZING -> READY -> RUNNING -> STOPPING -> STOPPED', async () => {
    const participant: ILifecycleParticipant = {
      name: 'test-participant',
      initialize: jest.fn().mockResolvedValue(undefined),
      start: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
    };

    manager.registerParticipant(participant);
    expect(registry.has('test-participant')).toBe(true);

    await manager.initialize();
    expect(participant.initialize).toHaveBeenCalled();
    expect(manager.getState()).toBe(LifecycleState.READY);

    await manager.start();
    expect(participant.start).toHaveBeenCalled();
    expect(manager.getState()).toBe(LifecycleState.RUNNING);

    await manager.stop();
    expect(participant.stop).toHaveBeenCalled();
    expect(manager.getState()).toBe(LifecycleState.STOPPED);
  });

  it('should transition to FAILED state if a participant throws during initialization', async () => {
    const participant: ILifecycleParticipant = {
      name: 'failing-participant',
      initialize: jest.fn().mockRejectedValue(new Error('Initialization failed')),
    };

    manager.registerParticipant(participant);

    await expect(manager.initialize()).rejects.toThrow('Initialization failed');
    expect(manager.getState()).toBe(LifecycleState.FAILED);
  });

  it('should transition to FAILED state if a participant throws during start', async () => {
    const participant: ILifecycleParticipant = {
      name: 'failing-start-participant',
      start: jest.fn().mockRejectedValue(new Error('Start failed')),
    };

    manager.registerParticipant(participant);
    await manager.initialize();

    await expect(manager.start()).rejects.toThrow('Start failed');
    expect(manager.getState()).toBe(LifecycleState.FAILED);
  });
});
