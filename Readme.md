# Kafka 101

A minimal Node.js + Kafka demo: an Express API that publishes payment events to Kafka and a consumer that processes them. Includes a **React cart UI** that posts the cart to the payment-service endpoint.

## Tech stack

- **Node.js** (ES modules)
- **Express** – HTTP API
- **KafkaJS** – Kafka client
- **React** + **Vite** – Cart UI (client)
- **Docker** – Kafka broker + Kafka UI

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Docker](https://www.docker.com/) and Docker Compose

## Project structure

```
kafka-101/
├── index.js              # Express app & payment-service endpoint
├── kafka/
│   ├── admin.js          # Topic create/delete (e.g. payment-topic)
│   ├── producer.js       # Kafka producer & sendMessage()
│   └── consumer.js       # Kafka consumer for payment-topic
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx       # Cart UI, checkout → /payment-service
│   │   ├── App.css
│   │   └── main.jsx
│   └── vite.config.js    # Proxy /payment-service → backend
├── docker-compose.yml    # Kafka + Kafka UI
└── package.json
```

## Getting started

### 1. Start Kafka

```bash
docker-compose up -d
```

- **Kafka broker:** `localhost:9092`
- **Kafka UI:** http://localhost:8080 (topics, messages, consumer groups)

### 2. Install dependencies

```bash
# Backend
pnpm install

# Client
cd client && pnpm install
```

### 3. Create the topic (optional)

If `payment-topic` doesn’t exist yet, run the admin script once from the project root:

```bash
node kafka/admin.js
```

### 4. Run the app

**Terminal 1 – backend**

```bash
pnpm start
# or for development with auto-reload:
pnpm run dev
```

Backend runs at **http://localhost:3000**.

**Terminal 2 – client**

```bash
cd client
pnpm run dev
```

Client runs at **http://localhost:5173** (Vite). The cart UI proxies `/payment-service` to the backend.

## Cart UI

Open **http://localhost:5173** to:

- Add items to the cart from the product grid
- Remove items from the cart
- Click **Proceed to payment** to POST the cart to `/payment-service`

The UI sends `{ cart: [{ id, name, price }, ...] }`; the backend publishes to Kafka and returns `{ message: "success" }`. A success or error toast appears after checkout.

## API

### Health check

```bash
curl http://localhost:3000/
```

### Payment service (publish to Kafka)

Sends a payment event (userId + cart) to the `payment-topic`:

```bash
curl --location 'http://localhost:3000/payment-service' \
  --header 'Content-Type: application/json' \
  --data '{
    "cart": [
        {
            "id": 1,
            "name": "pencil",
            "price": 10
        }
    ]
}'
```

Response: `{ "message": "success" }`. The consumer logs the message in the backend console.

## Scripts

| Command              | Description                         |
|----------------------|-------------------------------------|
| `pnpm start`         | Run backend (`node index.js`)       |
| `pnpm run dev`       | Run backend with nodemon            |
| `node kafka/admin.js`| Create `payment-topic`              |
| `cd client && pnpm run dev` | Run React dev server (Vite) |

## Flow

1. **From the UI:** User adds items to the cart and clicks **Proceed to payment**. The client POSTs to `/payment-service` with `{ cart }`.
2. **Backend:** Express handler calls `sendMessage("payment-topic", { userId, cart })`.
3. Producer publishes the JSON to `payment-topic`.
4. Consumer (started with the backend) reads from `payment-topic` and logs each message.

## Kafka UI

Open **http://localhost:8080** to:

- List topics and partitions
- Inspect messages on `payment-topic`
- View consumer group `express-group` and lag
