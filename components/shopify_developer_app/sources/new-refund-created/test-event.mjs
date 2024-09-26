export default {
  "id": 1002961240349,
  "order_id": 6273085767965,
  "created_at": "2024-08-20T11:19:18-04:00",
  "note": "",
  "user_id": 90630848797,
  "processed_at": "2024-08-20T11:19:18-04:00",
  "restock": true,
  "duties": [],
  "total_duties_set": {
    "shop_money": {
      "amount": "0",
      "currency_code": "VND"
    },
    "presentment_money": {
      "amount": "0",
      "currency_code": "VND"
    }
  },
  "return": null,
  "refund_shipping_lines": [],
  "admin_graphql_api_id": "gid://shopify/Refund/1002961240349",
  "order_adjustments": [],
  "refund_line_items": [
    {
      "id": 665556615453,
      "quantity": 1,
      "line_item_id": 16014782595357,
      "location_id": 76683084061,
      "restock_type": "cancel",
      "subtotal": 20,
      "total_tax": 0,
      "subtotal_set": {
        "shop_money": {
          "amount": "20",
          "currency_code": "VND"
        },
        "presentment_money": {
          "amount": "20",
          "currency_code": "VND"
        }
      },
      "total_tax_set": {
        "shop_money": {
          "amount": "0",
          "currency_code": "VND"
        },
        "presentment_money": {
          "amount": "0",
          "currency_code": "VND"
        }
      },
      "line_item": {
        "id": 16014782595357,
        "variant_id": 44392954495261,
        "title": "T-shirt 1",
        "quantity": 1,
        "sku": "",
        "variant_title": "Pipedream1003",
        "vendor": "Pipedream0930",
        "fulfillment_service": "manual",
        "product_id": 8137104785693,
        "requires_shipping": true,
        "taxable": false,
        "gift_card": false,
        "name": "T-shirt 1 - Pipedream1003",
        "variant_inventory_management": "shopify",
        "properties": [],
        "product_exists": true,
        "fulfillable_quantity": 0,
        "grams": 0,
        "price": "20",
        "total_discount": "0",
        "fulfillment_status": null,
        "price_set": {
          "shop_money": {
            "amount": "20",
            "currency_code": "VND"
          },
          "presentment_money": {
            "amount": "20",
            "currency_code": "VND"
          }
        },
        "total_discount_set": {
          "shop_money": {
            "amount": "0",
            "currency_code": "VND"
          },
          "presentment_money": {
            "amount": "0",
            "currency_code": "VND"
          }
        },
        "discount_allocations": [],
        "duties": [],
        "admin_graphql_api_id": "gid://shopify/LineItem/16014782595357",
        "tax_lines": [
          {
            "title": "VAT",
            "price": "0",
            "rate": 0.1,
            "channel_liable": false,
            "price_set": {
              "shop_money": {
                "amount": "0",
                "currency_code": "VND"
              },
              "presentment_money": {
                "amount": "0",
                "currency_code": "VND"
              }
            }
          }
        ]
      }
    }
  ],
  "transactions": [
    {
      "id": 7582534205725,
      "order_id": 6273085767965,
      "kind": "refund",
      "gateway": "manual",
      "status": "success",
      "message": "Refunded 20.00 from manual gateway",
      "created_at": "2024-08-20T11:19:18-04:00",
      "test": false,
      "authorization": null,
      "location_id": null,
      "user_id": 90630848797,
      "parent_id": 7582533648669,
      "processed_at": "2024-08-20T11:19:18-04:00",
      "device_id": null,
      "error_code": null,
      "source_name": "1830279",
      "receipt": {},
      "amount": "20",
      "currency": "VND",
      "payment_id": "#1031.2",
      "total_unsettled_set": {
        "presentment_money": {
          "amount": "0.0",
          "currency": "VND"
        },
        "shop_money": {
          "amount": "0.0",
          "currency": "VND"
        }
      },
      "manual_payment_gateway": true,
      "admin_graphql_api_id": "gid://shopify/OrderTransaction/7582534205725"
    }
  ]
}