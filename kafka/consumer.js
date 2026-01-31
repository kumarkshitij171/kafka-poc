import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "express-consumer",
  brokers: ["localhost:9092"],
});

export const consumer = kafka.consumer({ groupId: "express-group" });

export async function startConsumer({ topic }) {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const value = message.value.toString();
      const payload = JSON.parse(value);
      console.log({
        topic,
        value,
      });
    },
  });
}

startConsumer({ topic: "payment-topic" });
