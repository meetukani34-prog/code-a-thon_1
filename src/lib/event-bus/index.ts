import { IEventBus } from './types';
import { InMemoryEventBus } from './in-memory-bus';

let eventBusInstance: IEventBus | null = null;

/**
 * Factory: Returns Kafka bus if brokers configured, otherwise in-memory fallback.
 */
export async function getEventBus(): Promise<IEventBus> {
  if (eventBusInstance) return eventBusInstance;

  const kafkaBrokers = process.env.KAFKA_BROKERS;

  if (kafkaBrokers && kafkaBrokers !== 'localhost:9092') {
    try {
      const { KafkaEventBus } = await import('./kafka-client');
      eventBusInstance = KafkaEventBus.getInstance();
      console.log('[EventBus] Using Kafka event bus');
    } catch (error) {
      console.warn('[EventBus] Kafka unavailable, falling back to in-memory:', error);
      eventBusInstance = InMemoryEventBus.getInstance();
    }
  } else {
    eventBusInstance = InMemoryEventBus.getInstance();
    console.log('[EventBus] Using in-memory event bus (set KAFKA_BROKERS for production)');
  }

  return eventBusInstance;
}

export { TOPICS } from './types';
export type { EventPayload, IEventBus } from './types';
