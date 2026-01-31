import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "express-admin",
  brokers: ["localhost:9092"],
});

const admin = kafka.admin();

export async function createTopic(topicName) {
  console.log("Creating topic " + topicName);
  await admin.createTopics({
    topics: [
      {
        topic: topicName,
        numPartitions: 1,
        replicationFactor: 1,
      },
    ],
  });
}

export async function deleteTopic(topicName) {
  await admin.deleteTopics({
    topics: [topicName],
  });
}

export async function connectAdmin() {
  await admin.connect();
}

export async function disconnectAdmin() {
  await admin.disconnect();
}

const run = async () => {
  await connectAdmin();
  await createTopic("payment-topic");
  await disconnectAdmin();
};

run();
