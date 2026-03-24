export default {
  "id": 1,
  "external_id": "ORD123",
  "amount": 550,
  "click": {
    "created_at": "2021-03-03T12:39:19+0000",
    "referrer": "https://example-blog.inc/check-out-johns-product/",
    "landing_page": "https://tapper.inc/johns-cool-product/"
  },
  "commissions": [
    {
      "id": 1,
      "conversion_sub_amount": 550,
      "amount": 55,
      "commission_type": "standard",
      "approved": true,
      "affiliate": {
        "id": "janejameson",
        "firstname": "Jane",
        "lastname": "Jameson"
      },
      "kind": "regular",
      "currency": "USD",
      "created_at": null,
      "payout": null,
      "comment": null,
      "final": null,
      "commission_name": "standard"
    }
  ],
  "program": {
    "id": "johns-affiliate-program",
    "title": "John's affiliate program",
    "currency": "USD"
  },
  "affiliate": {
    "id": "janejameson",
    "firstname": "Jane",
    "lastname": "Jameson"
  },
  "customer": {
    "id": "cu_eXampl30th3r",
    "customer_id": "USER999",
    "status": "paying"
  },
  "meta_data": {
    "foo": "bar",
    "tap": "awesome"
  },
  "created_at": "2021-03-03T12:39:19+0000",
  "warnings": null,
  "affiliate_meta_data": {
    "subid1": "baz"
  }
}