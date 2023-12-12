export default  {
  "data": {
   "id": "LMFN-543196",
   "type": "orders",
   "attributes": {
    "item_count": 1,
    "item_total": "100.1",
    "discount_total": "10.0",
    "shipping_total": "10.0",
    "tax_total": "0.0",
    "total": "100.1",
    "customer_first_name": "Joe",
    "customer_last_name": "Somebody",
    "customer_email": "joe@somebody.com",
    "customer_phone_number": "+1 (123) 456-7890",
    "customer_opted_in_to_marketing": false,
    "customer_note": "Created by Joe",
    "shipping_address_1": "123 some street",
    "shipping_address_2": "#123",
    "shipping_city": "Somewhere",
    "shipping_state": "UT",
    "shipping_zip": "64801",
    "shipping_latitude": null,
    "shipping_longitude": null,
    "shipping_status": "unshipped",
    "payment_status": "completed",
    "created_at": "2014-12-25T00:00:00.000Z",
    "updated_at": "2014-12-25T00:00:00.000Z",
    "completed_at": "2014-12-25T00:00:00.000Z"
   },
   "links": {
    "self": "https://api.bigcartel.com/v1/accounts/1/orders/LMFN-543196"
   },
   "relationships": {
    "currency": {
     "data": {
      "type": "currencies",
      "id": "USD"
     }
    },
    "shipping_country": {
     "data": {
      "type": "countries",
      "id": "US"
     }
    },
    "events": {
     "data": [
      {
       "type": "order_events",
       "id": "1"
      }
     ]
    },
    "items": {
     "data": [
      {
       "type": "order_line_items",
       "id": "2"
      }
     ]
    },
    "transactions": {
     "data": [
      {
       "type": "order_transactions/payments",
       "id": "3"
      }
     ]
    },
    "adjustments": {
     "data": [
      {
       "type": "order_adjustments/shipping",
       "id": "4"
      },
      {
       "type": "order_adjustments/tax",
       "id": "5"
      },
      {
       "type": "order_adjustments/discount",
       "id": "6"
      }
     ]
    }
   }
  },
  "included": [
   {
    "id": "USD",
    "type": "currencies",
    "attributes": {
     "name": "U.S. Dollar",
     "sign": "$",
     "locale": "en-US"
    }
   },
   {
    "id": "US",
    "type": "countries",
    "attributes": {
     "name": "United States"
    }
   },
   {
    "id": "1",
    "type": "order_events",
    "attributes": {
     "created_at": "2014-12-25T00:00:00.000Z",
     "message": "Payment completed"
    }
   },
   {
    "id": "2",
    "type": "order_line_items",
    "attributes": {
     "product_name": "This product",
     "product_option_name": "This option",
     "quantity": 1,
     "price": "100.0",
     "total": "100.0",
     "image_url": "https://images.bigcartel.com/some_resource/12345/-/example.jpg"
    },
    "relationships": {
     "product": {
      "data": {
       "type": "product",
       "id": "7"
      }
     },
     "product_option": {
      "data": {
       "type": "product_option",
       "id": "8"
      }
     }
    }
   },
   {
    "id": "3",
    "type": "order_transactions/payments",
    "attributes": {
     "label": "Visa ending in 1234",
     "amount": "100.0",
     "processor": "stripe",
     "processor_id": "ex_123456789",
     "processor_url": "https://manage.stripe.com/test/payments/ex_123456789"
    },
    "relationships": {
     "currency": {
      "data": {
       "type": "currencies",
       "id": "USD"
      }
     }
    }
   },
   {
    "id": "4",
    "type": "order_adjustments/shipping",
    "attributes": {
     "amount": "10.0",
     "label": "Shipping charges"
    }
   },
   {
    "id": "5",
    "type": "order_adjustments/tax",
    "attributes": {
     "amount": "0.1"
    }
   },
   {
    "id": "6",
    "type": "order_adjustments/discount",
    "attributes": {
     "amount": "10.0",
     "label": "[FREESHIPPING] Free shipping discount"
    }
   }
  ]
 }