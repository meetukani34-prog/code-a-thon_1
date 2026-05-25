import { EventEmitter } from 'events';
import { IEventBus, EventHandler, EventPayload } from './types';

/**
 * In-Memory Event Bus — fallback when Kafka is not available.
 * Mirrors the Kafka API for seamless swapping.
 */
class InMemoryEventBus implements IEventBus {
  private emitter: EventEmitter;
  private static instance: InMemoryEventBus | null = null;

  private constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(50);
    console.log('[EventBus] In-memory event bus initialized');
  }

  static getInstance(): InMemoryEventBus {
    if (!InMemoryEventBus.instance) {
      InMemoryEventBus.instance = new InMemoryEventBus();
    }
    return InMemoryEventBus.instance;
  }

  async publish(topic: string, payload: EventPayload): Promise<void> {
    console.log(`[EventBus] Publishing to "${topic}":`, payload.event);
    // Emit asynchronously to mimic Kafka behavior
    setImmediate(() => {
      this.emitter.emit(topic, payload);
    });
  }

  async subscribe(topic: string, handler: EventHandler): Promise<void> {
    console.log(`[EventBus] Subscribed to "${topic}"`);
    this.emitter.on(topic, async (payload: EventPayload) => {
      try {
        await handler(payload);
      } catch (error) {
        console.error(`[EventBus] Error handling event on "${topic}":`, error);
      }
    });
  }

  async disconnect(): Promise<void> {
    this.emitter.removeAllListeners();
    InMemoryEventBus.instance = null;
    console.log('[EventBus] In-memory bus disconnected');
  }
}

export { InMemoryEventBus };
