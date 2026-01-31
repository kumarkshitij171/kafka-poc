

```
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