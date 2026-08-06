export default {
  "id": "evt_8e8d6d9e40c4",
  "type_string": "account.subscription.recur.failure",
  "api_version": "2019-03-15",
  "created": 1783627000000,
  "object": "subscription",
  "object_data": {
    "id": "sub_a2d34b5e7c91",
    "object": "subscription",
    "status": "failed",
    "livemode": null,
    "created": 1783500000000,
    "updated": 1783627000000,
    "amount_in_cents": 5000,
    "currency": "usd",
    "interval": "monthly",
    "next_charge_date": 1786219000000,
    "failure_reason": "card_declined",
    "failed_at": 1783627000000,
    "person": {
      "id": "per_ba25a0440913",
      "object": "person",
      "email": "dntlymail+per_ba25a0440913@donate.ly",
      "first_name": "Test",
      "last_name": "User"
    },
    "account": {
      "id": "act_30f454b5bc71",
      "object": "account",
      "title": "Test User",
      "subdomain": "test-user",
      "donately_homepage_url": "https://pages.donately.com/test-user",
      "status": "published",
      "currency": "usd"
    },
    "campaign": {
      "id": "cmp_1d8f19e47fe5",
      "object": "campaign",
      "title": "Monthly Giving"
    },
    "fundraiser": {}
  },
  "event_data": {
    "event": "failure"
  }
}