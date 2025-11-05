export default {
  eventName: "purchase.create",
  data: {
      "id": "68ee843389795bbf8d051801",
      "object": "purchase",
      "status": "committed",
      "reminders": [],
      "notes": [],
      "source": "office",
      "dueNow": 0,
      "customerName": "Obrien Quarsh Panaka",
      "customerEmail": "fagud@guerrillamail.info",
      "currency": "USD",
      "amount": 10,
      "balance": 0,
      "tags": [],
      "customerLocale": "en_US",
      "createdAt": "2025-10-14T17:11:15+00:00",
      "createdBy": {
          "id": "4f293e17536e86bc66000000"
      },
      "updatedAt": "2025-10-29T07:37:32+00:00",
      "conversation": {
          "id": "68ee843427790c08cb000d94"
      },
      "seller": {
          "id": "68ee76c38d57715e1204bdae"
      },
      "organizer": {
          "id": "68ee843427790c08cb000d67"
      },
      "splitPayment": {
          "enabled": false
      },
      "paymentReminders": [],
      "travelers": [
          {
              "id": "68ee843427790c08cb000d67"
          }
      ],
      "items": [
          {
              "id": "68ee843389795bbf8d051802",
              "amount": 10,
              "object": "scheduled_experience_purchase_item",
              "name": "The Forbidden Tour",
              "status": "confirmed",
              "source": "office",
              "quantity": 1,
              "product": {
                  "id": "68ee771119f95431a7038e33"
              },
              "createdAt": "2025-10-14T17:11:15+00:00",
              "updatedAt": "2025-10-29T07:37:32+00:00",
              "ip": "76.132.193.240",
              "seller": {
                  "id": "68ee76c38d57715e1204bdae"
              },
              "purchase": {
                  "id": "68ee843389795bbf8d051801"
              },
              "lineItems": [
                  {
                      "id": "68ee843389795bbf8d0517d5",
                      "object": "line_item",
                      "type": "demographic",
                      "name": "Guests",
                      "lineItemObject": "line_item",
                      "code": "guest",
                      "destination": "seller",
                      "visibility": "all",
                      "visible": true,
                      "system": false,
                      "includeInAmount": true,
                      "createdBy": {
                          "id": "4f293e17536e86bc66000000"
                      },
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 10,
                      "price": 10,
                      "quantity": 1,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204bdbc"
                      },
                      "sequence": 10000
                  },
                  {
                      "id": "68ee843389795bbf8d0517d9",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Demographic Subtotal",
                      "lineItemObject": "line_item",
                      "code": "demographic_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 10,
                      "price": null,
                      "quantity": 1,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204bdbf"
                      },
                      "templateCode": "demographic_subtotal"
                  },
                  {
                      "id": "68ee843389795bbf8d0517de",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Merchandise Subtotal",
                      "lineItemObject": "line_item",
                      "code": "merchandise_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 0,
                      "price": null,
                      "quantity": 0,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204bdca"
                      },
                      "templateCode": "merchandise_subtotal"
                  },
                  {
                      "id": "68ee843389795bbf8d0517e2",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Pickup Subtotal",
                      "lineItemObject": "line_item",
                      "code": "pickup_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 0,
                      "price": null,
                      "quantity": 0,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204bdd5"
                      },
                      "templateCode": "pickup_subtotal"
                  },
                  {
                      "id": "68ee843389795bbf8d0517e6",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Unit Subtotal",
                      "lineItemObject": "line_item",
                      "code": "unit_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 10,
                      "price": null,
                      "quantity": 1,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204bde0"
                      },
                      "templateCode": "unit_subtotal"
                  },
                  {
                      "id": "68ee843389795bbf8d0517ea",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Discount Subtotal",
                      "lineItemObject": "line_item",
                      "code": "discount_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 0,
                      "price": null,
                      "quantity": 0,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204bdeb"
                      },
                      "templateCode": "discount_subtotal"
                  },
                  {
                      "id": "68ee843389795bbf8d0517ee",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Pre-tax-fee Subtotal",
                      "lineItemObject": "line_item",
                      "code": "pre_tax_fee_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 10,
                      "price": null,
                      "quantity": null,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204bdf6"
                      },
                      "templateCode": "pre_tax_fee_subtotal"
                  },
                  {
                      "id": "68ee843389795bbf8d0517f1",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Fee Subtotal",
                      "lineItemObject": "line_item",
                      "code": "fee_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 0,
                      "price": null,
                      "quantity": 0,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204bdff"
                      },
                      "templateCode": "fee_subtotal"
                  },
                  {
                      "id": "68ee843389795bbf8d0517f5",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Pre-tax Subtotal",
                      "lineItemObject": "line_item",
                      "code": "pre_tax_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 10,
                      "price": null,
                      "quantity": null,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204be0c"
                      },
                      "templateCode": "pre_tax_subtotal"
                  },
                  {
                      "id": "68ee843389795bbf8d0517f8",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Tax Subtotal",
                      "lineItemObject": "line_item",
                      "code": "tax_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 0,
                      "price": null,
                      "quantity": 0,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204be15"
                      },
                      "templateCode": "tax_subtotal"
                  },
                  {
                      "id": "68ee843389795bbf8d0517fc",
                      "object": "line_item",
                      "type": "sub_total",
                      "name": "Pre Service Fee Item Subtotal",
                      "lineItemObject": "line_item",
                      "code": "pre_partner_fee_item_subtotal",
                      "visibility": "none",
                      "seller": {
                          "id": "68ee76c38d57715e1204bdae"
                      },
                      "visible": false,
                      "system": true,
                      "includeInAmount": false,
                      "createdAt": "2025-10-14T17:11:16+00:00",
                      "updatedAt": "2025-10-14T17:11:16+00:00",
                      "amount": 10,
                      "price": null,
                      "quantity": null,
                      "due": 0,
                      "collected": 0,
                      "multiplier": 1,
                      "template": {
                          "id": "68ee76c38d57715e1204be22"
                      },
                      "templateCode": "pre_partner_fee_item_subtotal"
                  }
              ],
              "organizer": {
                  "name": "Obrien Quarsh Panaka updated",
                  "email": "fagud@guerrillamail.info",
                  "user": {
                      "id": "68ee843427790c08cb000d67"
                  }
              },
              "updatedBy": {
                  "id": "4f293e17536e86bc66000000"
              },
              "ticketCode": "3jcy73v74cu8",
              "shortCode": "b6c9d0",
              "deposit": {
                  "enabled": false
              },
              "reminders": [
                  {
                      "type": "purchase_trip_reminder_traveler",
                      "sendReminderAt": "2025-11-16T19:00:00+00:00",
                      "status": "active"
                  },
                  {
                      "type": "purchase_review_reminder_traveler",
                      "sendReminderAt": "2025-11-18T19:59:59+00:00",
                      "status": "active"
                  }
              ],
              "waivers": [],
              "guests": [
                  {
                      "id": "68ee843389795bbf8d0517d6",
                      "name": "Owen Harvey",
                      "unit": {
                          "id": "68ee76c38d57715e1204bdbb"
                      },
                      "template": {
                          "id": "68ee76c38d57715e1204bdbc"
                      },
                      "ticketCode": "bdb9klupba8k",
                      "primary": false,
                      "guestStatus": "pending",
                      "checkInCount": 0,
                      "checkIns": []
                  }
              ],
              "tickets": [
                  {
                      "type": "xola",
                      "ticketCode": "3jcy73v74cu8"
                  }
              ],
              "guestStatus": "pending",
              "firstCheckInAt": null,
              "event": {
                  "id": "68ee7af91d3dd6518b19a53f"
              },
              "arrivalDate": "2025-11-17",
              "privacy": "public",
              "duration": 60,
              "arrivalTime": 1300,
              "arrivalDateTime": "2025-11-17T13:00:00-06:00"
          }
      ],
      "lineItems": [
          {
              "id": "68ee843427790c08cb000d66",
              "object": "payment_line_item",
              "type": "payment",
              "name": "Payment",
              "visibility": "all",
              "visible": true,
              "system": false,
              "includeInAmount": false,
              "createdBy": {
                  "id": "4f293e17536e86bc66000000"
              },
              "createdAt": "2025-10-14T17:11:16+00:00",
              "updatedAt": "2025-10-14T17:11:18+00:00",
              "amount": -10,
              "price": null,
              "quantity": null,
              "due": 0,
              "collected": 0,
              "multiplier": 1,
              "status": "complete",
              "payment": {
                  "method": "cc",
                  "card": "68ee843427790c08cb000d95",
                  "meta": {
                      "cardSummary": {
                          "brand": "American Express",
                          "last4": "8431",
                          "expMonth": 10,
                          "funding": "credit",
                          "expYear": 2026,
                          "id": "68ee843427790c08cb000d95",
                          "default": true,
                          "name": null
                      }
                  },
                  "transaction": {
                      "id": "68ee843527790c08cb000d97"
                  },
                  "remoteId": "ch_2SIBknjhWC3jcChC0ZQNwR2P"
              },
              "traveler": {
                  "id": "68ee843427790c08cb000d67",
                  "name": "Obrien Quarsh Panaka updated"
              }
          },
          {
              "id": "68ee843427790c08cb000d90",
              "object": "line_item",
              "type": "sub_total",
              "name": "Service Fee Subtotal",
              "lineItemObject": "line_item",
              "code": "pre_partner_fee_subtotal",
              "visibility": "none",
              "seller": {
                  "id": "68ee76c38d57715e1204bdae"
              },
              "visible": false,
              "system": true,
              "includeInAmount": false,
              "createdAt": "2025-10-14T17:11:16+00:00",
              "updatedAt": "2025-10-14T17:11:16+00:00",
              "amount": 10,
              "price": null,
              "quantity": null,
              "due": 0,
              "collected": 0,
              "multiplier": 1,
              "template": {
                  "id": "68ee76c9738f2b9fd1078fc3"
              },
              "templateCode": "pre_partner_fee_subtotal"
          },
          {
              "id": "68ee843427790c08cb000d92",
              "object": "line_item",
              "type": "processing_fee",
              "name": "Processing Fees",
              "lineItemObject": "line_item",
              "code": "processing_fees",
              "destination": "xola",
              "visibility": "none",
              "seller": {
                  "id": "68ee76c38d57715e1204bdae"
              },
              "visible": false,
              "system": true,
              "includeInAmount": false,
              "createdAt": "2025-10-14T17:11:16+00:00",
              "updatedAt": "2025-10-14T17:11:18+00:00",
              "amount": 0.54,
              "price": null,
              "quantity": null,
              "due": 0,
              "collected": 0.54,
              "multiplier": 1,
              "template": {
                  "id": "68ee76c38d57715e1204be3b"
              },
              "templateCode": "processing_fees"
          }
      ],
      "updatedBy": {
          "id": "4f293e17536e86bc66000000"
      }
  },
  audit: {},
};

