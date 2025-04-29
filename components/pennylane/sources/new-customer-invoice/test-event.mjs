export default {
  "id": "wMoOACctiA",
  "label": "Invoice label",
  "invoice_number": "Invoice number",
  "quote_group_uuid": "b50b8fe6-48ce-4380-b9b3-52eec688fc04",
  "is_draft": true,
  "is_estimate": true,
  "currency": "EUR",
  "amount": "230.32",
  "currency_amount": "230.32",
  "currency_amount_before_tax": "196.32",
  "exchange_rate": 1,
  "date": "2023-08-30",
  "deadline": "2020-09-02",
  "currency_tax": "34.0",
  "language": "fr_FR",
  "paid": false,
  "status": "upcoming",
  "discount": "50.1",
  "discount_type": "relative",
  "public_url": "https://app.pennylane.com/...",
  "file_url": "https://app.pennylane.com/.../file.pdf",
  "filename": "my_file.pdf",
  "remaining_amount": "20.0",
  "source": "email",
  "special_mention": "Additional details",
  "updated_at": "2023-08-30T10:08:08.146343Z",
  "imputation_dates": {
    "start_date": "2020-06-30",
    "end_date": "2021-06-30"
  },
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
      "raw_currency_unit_price": "5",
      "discount": "25",
      "discount_type": "relative",
      "section_rank": 1,
      "v2_id": 1234
    }
  ],
  "categories": [
    {
      "source_id": "38a1f19a-256d-4692-a8fe-0a16403f59ff",
      "weight": 0.8,
      "label": "Alimentaire",
      "direction": "cash_in",
      "created_at": "2023-08-30T10:08:08.146343Z",
      "updated_at": "2023-08-30T10:08:08.146343Z",
      "v2_id": 1234
    }
  ],
  "transactions_reference": {
    "banking_provider": "bank",
    "provider_field_name": "label",
    "provider_field_value": "invoice_number"
  },
  "payments": [
    {
      "label": "string",
      "created_at": "2023-08-30",
      "currency_amount": "string"
    }
  ],
  "matched_transactions": [
    {
      "label": "string",
      "amount": "string",
      "group_uuid": "string",
      "date": "2023-08-30",
      "fee": "string",
      "currency": "string"
    }
  ],
  "pdf_invoice_free_text": "string",
  "pdf_invoice_subject": "string",
  "billing_subscription": {
    "id": 0,
    "v2_id": 1234
  },
  "credit_notes": [
    {
      "id": "BCVPZQJ17V",
      "amount": "230.32",
      "tax": "34.0",
      "currency": "EUR",
      "currency_amount": "230.32",
      "currency_tax": "230.32",
      "currency_price_before_tax": "196.32",
      "invoice_number": "Credit note number",
      "draft": false,
      "v2_id": 1234
    }
  ],
  "v2_id": 1234
}