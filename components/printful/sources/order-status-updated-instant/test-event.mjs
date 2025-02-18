export default {
  "type": "order_updated",
  "created": 1622456737,
  "retries": 2,
  "store": 12,
  "data": {
    "order": {
      "id": 13,
      "external_id": "4235234213",
      "store": 10,
      "status": "draft",
      "shipping": "STANDARD",
      "shipping_service_name": "Flat Rate (3-4 business days after fulfillment)",
      "created": 1602607640,
      "updated": 1602607640,
      "recipient": {
        "name": "John Smith",
        "company": "John Smith Inc",
        "address1": "19749 Dearborn St",
        "address2": "string",
        "city": "Chatsworth",
        "state_code": "CA",
        "state_name": "California",
        "country_code": "US",
        "country_name": "United States",
        "zip": "91311",
        "phone": "2312322334",
        "email": "firstname.secondname@domain.com",
        "tax_number": "123.456.789-10"
      },
      "items": [
        {
          "id": 1,
          "external_id": "item-1",
          "variant_id": 1,
          "sync_variant_id": 1,
          "external_variant_id": "variant-1",
          "warehouse_product_variant_id": 1,
          "product_template_id": 1,
          "quantity": 1,
          "price": "13.00",
          "retail_price": "13.00",
          "name": "Enhanced Matte Paper Poster 18×24",
          "product": {
            "variant_id": 3001,
            "product_id": 301,
            "image": "https://files.cdn.printful.com/products/71/5309_1581412541.jpg",
            "name": "Bella + Canvas 3001 Unisex Short Sleeve Jersey T-Shirt with Tear Away Label (White / 4XL)"
          },
          "files": [
            {
              "type": "default",
              "id": 10,
              "url": "https://www.example.com/files/tshirts/example.png",
              "options": [
                {
                  "id": "template_type",
                  "value": "native"
                }
              ],
              "hash": "ea44330b887dfec278dbc4626a759547",
              "filename": "shirt1.png",
              "mime_type": "image/png",
              "size": 45582633,
              "width": 1000,
              "height": 1000,
              "dpi": 300,
              "status": "ok",
              "created": 1590051937,
              "thumbnail_url": "https://files.cdn.printful.com/files/ea4/ea44330b887dfec278dbc4626a759547_thumb.png",
              "preview_url": "https://files.cdn.printful.com/files/ea4/ea44330b887dfec278dbc4626a759547_thumb.png",
              "visible": true,
              "is_temporary": false
            }
          ],
          "options": [
            {
              "id": "OptionKey",
              "value": "OptionValue"
            }
          ],
          "sku": null,
          "discontinued": true,
          "out_of_stock": true
        }
      ],
      "branding_items": [
        {
          "id": 1,
          "external_id": "item-1",
          "variant_id": 1,
          "sync_variant_id": 1,
          "external_variant_id": "variant-1",
          "warehouse_product_variant_id": 1,
          "product_template_id": 1,
          "quantity": 1,
          "price": "13.00",
          "retail_price": "13.00",
          "name": "Enhanced Matte Paper Poster 18×24",
          "product": {
            "variant_id": 3001,
            "product_id": 301,
            "image": "https://files.cdn.printful.com/products/71/5309_1581412541.jpg",
            "name": "Bella + Canvas 3001 Unisex Short Sleeve Jersey T-Shirt with Tear Away Label (White / 4XL)"
          },
          "files": [
            {
              "type": "default",
              "id": 10,
              "url": "https://www.example.com/files/tshirts/example.png",
              "options": [
                {
                  "id": "template_type",
                  "value": "native"
                }
              ],
              "hash": "ea44330b887dfec278dbc4626a759547",
              "filename": "shirt1.png",
              "mime_type": "image/png",
              "size": 45582633,
              "width": 1000,
              "height": 1000,
              "dpi": 300,
              "status": "ok",
              "created": 1590051937,
              "thumbnail_url": "https://files.cdn.printful.com/files/ea4/ea44330b887dfec278dbc4626a759547_thumb.png",
              "preview_url": "https://files.cdn.printful.com/files/ea4/ea44330b887dfec278dbc4626a759547_thumb.png",
              "visible": true,
              "is_temporary": false
            }
          ],
          "options": [
            {
              "id": "OptionKey",
              "value": "OptionValue"
            }
          ],
          "sku": null,
          "discontinued": true,
          "out_of_stock": true
        }
      ],
      "incomplete_items": [
        {
          "name": "Red T-Shirt",
          "quantity": 1,
          "sync_variant_id": 70,
          "external_variant_id": "external-id",
          "external_line_item_id": "external-line-item-id"
        }
      ],
      "costs": {
        "currency": "USD",
        "subtotal": "10.00",
        "discount": "0.00",
        "shipping": "5.00",
        "digitization": "0.00",
        "additional_fee": "0.00",
        "fulfillment_fee": "0.00",
        "retail_delivery_fee": "0.00",
        "tax": "0.00",
        "vat": "0.00",
        "total": "15.00"
      },
      "retail_costs": {
        "currency": "USD",
        "subtotal": "10.00",
        "discount": "0.00",
        "shipping": "5.00",
        "tax": "0.00",
        "vat": "0.00",
        "total": "15.00"
      },
      "pricing_breakdown": [
        {
          "customer_pays": "3.75",
          "printful_price": "6",
          "profit": "-2.25",
          "currency_symbol": "USD"
        }
      ],
      "shipments": [
        {
          "id": 10,
          "carrier": "FEDEX",
          "service": "FedEx SmartPost",
          "tracking_number": 0,
          "tracking_url": "https://www.fedex.com/fedextrack/?tracknumbers=0000000000",
          "created": 1588716060,
          "ship_date": "2020-05-05",
          "shipped_at": 1588716060,
          "reshipment": false,
          "items": [
            {
              "item_id": 1,
              "quantity": 1,
              "picked": 1,
              "printed": 1
            }
          ]
        }
      ],
      "gift": {
        "subject": "To John",
        "message": "Have a nice day"
      },
      "packing_slip": {
        "email": "your-name@your-domain.com",
        "phone": "+371 28888888",
        "message": "Message on packing slip",
        "logo_url": "http://www.your-domain.com/packing-logo.png",
        "store_name": "Your store name",
        "custom_order_id": "kkk2344lm"
      }
    }
  }
}