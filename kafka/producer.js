import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "express-producer",
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();

export async function connectProducer() {
  try {
    await producer.connect();
  } catch (error) {
    console.error("Errot while connecting producer: " + error);
  }
}

export async function sendMessage(topic, message) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
}
