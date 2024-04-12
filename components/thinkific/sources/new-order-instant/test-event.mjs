export default {
  "id": "20180126172320940835610",
  "resource": "order",
  "action": "created",
  "tenant_id": "3",
  "created_at": "2018-01-26T22:23:20.808Z",
  "payload": {
    "affiliate_referral_code": null,
    "amount_cents": 5000,
    "amount_dollars": 50,
    "billing_name": "Robert Smith",
    "coupon": {
      "id": 12345678,
      "code": "discount123",
      "promotion_id": 1234567
    },
    "created_at": "2018-01-26T22:23:18.400Z",
    "id": 19796,
    "order_number": 1010,
    "payment_type": "one-time",
    "product_id": 1,
    "product_name": "Introduction to Webhooks",
    "status": "Complete",
    "items": [
      {
        "product_id": 1,
        "product_name": "Introduction to Webhooks",
        "amount_dollars": 50,
        "amount_cents": 5000
      }
    ],
    "user": {
      "email": "ninjas@thinkific.com",
      "first_name": "Robert",
      "id": 123456,
      "last_name": "Smith"
    }
  }
}