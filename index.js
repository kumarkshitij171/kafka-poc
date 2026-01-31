import express from "express";
import { connectProducer, producer, sendMessage } from "./kafka/producer.js";
import { startConsumer } from "./kafka/consumer.js";

const app = express();
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.status(200).json({ message: "ok" });
});

app.post("/payment-service", async (req, res) => {
  const { cart } = req.body;
  // get user id from token
  const userId = "171";
  await sendMessage("payment-topic", {
    userId,
    cart,
  });
  return res.status(200).json({ message: "success" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Something broke!");
});

app.listen(port, () => {
  connectProducer();
  startConsumer({ topic: "payment-topic" });
  console.log("Example app listening on port " + port + "!");
});
