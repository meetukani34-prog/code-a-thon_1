import { Kafka, Producer, Consumer, logLevel } from 'kafkajs';
import { IEventBus, EventHandler, EventPayload } from './types';

/**
 * KafkaJS Event Bus — production-ready async event mesh.
 */
class KafkaEventBus implements IEventBus {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();
  private static instance: KafkaEventBus | null = null;

  private constructor() {
    const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
    const clientId = process.env.KAFKA_CLIENT_ID || 'campus-os';

    this.kafka = new Kafka({
      clientId,
      brokers,
      logLevel: logLevel.WARN,
      retry: {
        initialRetryTime: 300,
        retries: 5,
      },
    });

    this.producer = this.kafka.producer();
    console.log('[KafkaBus] Kafka event bus initialized');
  }

  static getInstance(): KafkaEventBus {
    if (!KafkaEventBus.instance) {
      KafkaEventBus.instance = new KafkaEventBus();
    }
    return KafkaEventBus.instance;
  }

  async publish(topic: string, payload: EventPayload): Promise<void> {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic,
        messages: [
          {
            key: ('campusId' in payload ? payload.campusId : 'global'),
            value: JSON.stringify(payload),
            timestamp: String(Date.now()),
          },
        ],
      });
      console.log(`[KafkaBus] Published to "${topic}":`, payload.event);
    } catch (error) {
      console.error(`[KafkaBus] Publish error on "${topic}":`, error);
      throw error;
    }
  }

  async subscribe(topic: string, handler: EventHandler): Promise<void> {
    const groupId = `campus-os-${topic.replace(/\./g, '-')}-group`;
    const consumer = this.kafka.consumer({ groupId });

    try {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });
      
      await consumer.run({
        eachMessage: async ({ message }) => {
          try {
            const payload = JSON.parse(message.value?.toString() || '{}') as EventPayload;
            await handler(payload);
          } catch (error) {
            console.error(`[KafkaBus] Consumer error on "${topic}":`, error);
            // TODO: Route to Dead Letter Queue
          }
        },
      });

      this.consumers.set(topic, consumer);
      console.log(`[KafkaBus] Subscribed to "${topic}" with group "${groupId}"`);
    } catch (error) {
      console.error(`[KafkaBus] Subscribe error on "${topic}":`, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
    for (const [topic, consumer] of this.consumers) {
      await consumer.disconnect();
      console.log(`[KafkaBus] Consumer for "${topic}" disconnected`);
    }
    this.consumers.clear();
    KafkaEventBus.instance = null;
    console.log('[KafkaBus] Kafka bus disconnected');
  }
}

export { KafkaEventBus };
