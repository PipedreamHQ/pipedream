export default {
  "id": 0,
  "next_occurrence": "string",
  "prev_occurrence": "string",
  "stopped_at": "2023-08-30T10:08:08.146343Z",
  "start": "2023-01-01",
  "finish": "2023-12-31",
  "status": "string",
  "mode": "string",
  "email_settings": {},
  "activated_at": "2023-08-30T10:08:08.146343Z",
  "payment_method": "string",
  "recurring_rule": {
    "day_of_month": [
      0
    ],
    "week_start": 0,
    "day": [
      0
    ],
    "rule_type": "weekly",
    "interval": 0,
    "count": 12,
    "until": "string"
  },
  "customer": {
    "first_name": "John",
    "last_name": "Doe",
    "gender": "mister",
    "name": "Pennylane",
    "reg_no": "XXXXXXXXX",
    "vat_number": "FR12345678910",
    "updated_at": "2023-08-30T10:08:08.146343Z",
    "source_id": "38a1f19a-256d-4692-a8fe-0a16403f59ff",
    "emails": [
      "hello@example.org"
    ],
    "billing_iban": "FRXX XXXX XXXX XXXX XXXX XXXX XXX",
    "customer_type": "company",
    "address": "4 rue du faubourg saint martin",
    "postal_code": "75010",
    "city": "Paris",
    "country_alpha2": "FR",
    "recipient": "string",
    "billing_address": {
      "address": "string",
      "postal_code": "string",
      "city": "string",
      "country_alpha2": "string"
    },
    "delivery_address": {
      "address": "105 Rue Mondenard",
      "postal_code": "33100",
      "city": "Bordeaux",
      "country_alpha2": "FR"
    },
    "payment_conditions": "upon_receipt",
    "phone": "+33123232323",
    "reference": "This is a custom reference",
    "notes": "This is a note",
    "v2_id": 1234
  },
  "invoice_template": {
    "label": "Invoice label",
    "currency": "EUR",
    "amount": "230.32",
    "currency_amount": "230.32",
    "currency_amount_before_tax": "196.32",
    "exchange_rate": "1.0",
    "payment_condition": "15_days",
    "currency_tax": "34.0",
    "language": "fr_FR",
    "discount": "50.1",
    "discount_type": "relative",
    "special_mention": "Additional details",
    "updated_at": "2023-08-30T10:08:08.146343Z",
    "line_items_sections_attributes": [
      {
        "title": "Line items section title",
        "description": "Description of the line items section",
        "rank": 1
      }
    ],
    "line_items": [
      {
        "id": 444,
        "label": "Demo label",
        "unit": "piece",
        "quantity": 12,
        "amount": "50.4",
        "currency_amount": "50.4",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        "product_id": "9bca2815-217a-4210-bed8-73139977b9a8",
        "product_v2_id": 1234,
        "vat_rate": "FR_200",
        "currency_price_before_tax": "30",
        "currency_tax": "10",
        "discount": "25",
        "discount_type": "relative",
        "section_rank": 1,
        "v2_id": 1234
      }
    ]
  },
  "v2_id": 1234
}