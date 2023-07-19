export default  {
  "id": "evt_1AATv1K2Bw1IESNf1ooA2aOS",
  "object": "event",
  "api_version": "2022-09-01",
  "created": 1683416474,
  "data": {
   "object": {
    "id": "ch_1AATv1K2Bw1IESNf1tBaHPg2",
    "object": "charge",
    "amount": 3500,
    "amount_captured": 3500,
    "amount_refunded": 0,
    "application": null,
    "application_fee": null,
    "application_fee_amount": null,
    "balance_transaction": "txn_1AATv1K2Bw1IESNf09wxyDEk",
    "billing_details": {
     "address": {
      "city": null,
      "country": null,
      "line1": null,
      "line2": null,
      "postal_code": null,
      "state": null
     },
     "email": null,
     "name": null,
     "phone": null
    },
    "calculated_statement_descriptor": "Stripe",
    "captured": true,
    "created": 1683416472,
    "currency": "usd",
    "customer": null,
    "description": "(created by Stripe CLI)",
    "destination": null,
    "dispute": null,
    "disputed": false,
    "failure_balance_transaction": null,
    "failure_code": null,
    "failure_message": null,
    "fraud_details": {},
    "invoice": null,
    "livemode": false,
    "metadata": {},
    "on_behalf_of": null,
    "order": null,
    "outcome": {
     "network_status": "approved_by_network",
     "reason": null,
     "risk_level": "normal",
     "risk_score": 60,
     "seller_message": "Payment complete.",
     "type": "authorized"
    },
    "paid": true,
    "payment_intent": "pi_1AATv1K2Bw1IESNf1J5xTbak",
    "payment_method": "pm_1AATv1K2Bw1IESNfStsZDeKR",
    "payment_method_details": {
     "card": {
      "brand": "mastercard",
      "checks": {
       "address_line1_check": null,
       "address_postal_code_check": null,
       "cvc_check": null
      },
      "country": "US",
      "exp_month": 7,
      "exp_year": 2025,
      "fingerprint": "BmKBF1PQd8dJNKgt",
      "funding": "credit",
      "installments": null,
      "last4": "1234",
      "mandate": null,
      "network": "mastercard",
      "network_token": {
       "used": false
      },
      "three_d_secure": null,
      "wallet": null
     },
     "type": "card"
    },
    "receipt_email": null,
    "receipt_number": null,
    "receipt_url": "https://pay.stripe.com/receipts/payment/CRreFwkFYXNudF3xLWwoFrTL1Mr2IFFTNfBNvQcQMIaGF5oN5UBvOLi5LAaTSzXittqp9os_RumLDTf9DUMBeTuFAQDQkSizoOProHPoPr6fH4N65Ff8",
    "refunded": false,
    "refunds": {
     "object": "list",
     "data": [],
     "has_more": false,
     "total_count": 0,
     "url": "/v1/charges/ch_1AATv1K2Bw1IESNf1tBaHPg2/refunds"
    },
    "review": null,
    "shipping": null,
    "source": null,
    "source_transfer": null,
    "statement_descriptor": null,
    "statement_descriptor_suffix": null,
    "status": "succeeded",
    "transfer_data": null,
    "transfer_group": null
   },
   "previous_attributes": {
    "amount_captured": 0,
    "balance_transaction": null,
    "captured": false,
    "receipt_url": "https://pay.stripe.com/receipts/payment/CRreFwkFYXNudF3xLWwoFrTL1Mr2IFFTNfBNvQcQMIaGF4Z8KTXBfQk6LAbaqCq5wkSSMWoBFHG3fwVDeZNhcR0PLJtc-2dv2ddcqNueDQRinfUn8Ds"
   }
  },
  "livemode": false,
  "pending_webhooks": 2,
  "request": {
   "id": "req_3y333lba6DdHnE",
   "idempotency_key": "5293935f-d777-431c-82f8-892ace8d5359"
  },
  "type": "charge.captured"
 }