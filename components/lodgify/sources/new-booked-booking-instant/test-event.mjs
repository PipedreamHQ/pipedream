export default {
  "action": "booking_new_status_booked",
  "booking": {
    "type": "Booking",
    "id": 123456,
    "date_arrival": "2022-05-21T00:00:00",
    "date_departure": "2022-05-24T00:00:00",
    "date_created": "2022-05-17T19:48:14+00:00",
    "property_id": 10000,
    "property_name": "Amazing Property on the Beach",
    "property_image_url": "https://l.icdbcdn.com/oh/71466fcc-6bb9-4b52-8145-3dc22fc435534e.jpg?f=32",
    "status": "Booked",
    "room_types": [
      {
        "id": 999999,
        "room_type_id": 12345,
        "image_url": null,
        "name": "",
        "people": 1
      }
    ],
    "add_ons": [],
    "currency_code": "USD",
    "source": "AirbnbIntegration",
    "source_text": "XXXXXXX9",
    "notes": null,
    "language": "en",
    "ip_address": null,
    "ip_country": null,
    "is_policy_active": true,
    "external_url": null,
    "nights": 3,
    "promotion_code": null
  },
  "guest": {
    "uid": "AJgBFoLdfe533443JrDha0E2kGg",
    "name": "John Doe",
    "email": "johndoe@lodgify.com",
    "phone_number": "667675867768",
    "country": null,
    "country_code": null
  },
  "current_order": {
    "id": 12343,
    "property_id": 10000,
    "currency_code": "USD",
    "status": "Agreed",
    "amount_gross": {
      "amount": "1235",
      "total_room_rate_amount": "900",
      "total_fees_amount": "282",
      "total_taxes_amount": "53",
      "total_promotions_amount": "0"
    },
    "amount_net": {
      "amount": "1113",
      "total_room_rate_amount": "778",
      "total_fees_amount": "282",
      "total_taxes_amount": "53",
      "total_promotions_amount": "0"
    },
    "amount_vat": {
      "amount": "122",
      "total_room_rate_amount": "122",
      "total_fees_amount": "0",
      "total_taxes_amount": "0",
      "total_promotions_amount": "0"
    },
    "date_agreed": "2022-05-17T19:56:32+00:00",
    "cancellation_policy_text": "",
    "security_deposit_text": "",
    "scheduled_policy_text": "Not scheduled in Lodgify",
    "rate_policy_name": "Reservation start date > 2 weeks",
    "rental_agreement_accepted": true,
    "owner_payout": 0.0000
  },
  "subowner": {
    "user_id": 23244,
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "janedoe@lodgify.com",
    "phone": "66456534545"
  },
  "booking_total_amount": "1113",
  "booking_currency_code": "USD",
  "total_transactions": {
    "amount": "0"
  },
  "balance_due": "1113"
}