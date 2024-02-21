export default {
  "id": "evt_9tafmf170u6fs6c0cla6h8otz",
  "type": "InvoiceCreated",
  "data": {
    "vatMode": "Auto",
    "isDraft": true,
    "isPaid": true,
    "isProforma": false,
    "isCancelled": false,
    "replacedBy": null,
    "overdue": 0,
    "cancellationCreditId": null,
    "cancellationCreditNumber": null,
    "id": 222218,
    "number": "000001",
    "date": "2024-02-05",
    "customerId": 105279,
    "customerNumber": "1",
    "customerName": "Test",
    "customerVatNumber": null,
    "customerOrderReference": null,
    "billingContact": {
      "title": null,
      "lastName": "Test",
      "firstName": null,
      "email": "test1@example.com",
      "cellPhone": null,
      "phone": null,
      "companyName": null,
      "displayName": "Test",
      "invertedDisplayName": "Test"
    },
    "billingAddress": {
      "street": "",
      "zipcode": "",
      "city": "",
      "countryIso": "FR",
      "formattedAddress": "France",
      "inlineAddress": "France"
    },
    "shippingContact": null,
    "shippingAddress": null,
    "subject": null,
    "useTaxIncludedPrices": false,
    "vatReverseCharge": false,
    "lines": [
      {
        "id": 5244192,
        "description": "product1",
        "taxExcludedPrice": 0,
        "taxIncludedPrice": 0,
        "quantity": 1,
        "taxExcludedAmount": 0,
        "taxIncludedAmount": 0,
        "discount": {
          "type": "Percent",
          "value": 0
        },
        "date": null,
        "type": "Product",
        "productId": 79349,
        "productNumber": "1",
        "purchasePrice": 0,
        "marginRate": 0,
        "marginAmount": 0,
        "product": {
          "id": 79349,
          "name": "product1",
          "number": "1",
          "unitPrice": 0,
          "isUnitPriceTaxIncluded": false,
          "type": "Product",
          "purchasePrice": 0,
          "defaultQuantity": 0,
          "description": null,
          "vat": null,
          "unit": null,
          "active": true
        },
        "vat": {
          "id": 19381,
          "rate": 20,
          "region": "FR",
          "label": "20.0% - FR",
          "default": true
        },
        "unit": null
      }
    ],
    "grossTaxExcludedAmount": 0,
    "globalDiscount": {
      "type": "Percent",
      "value": 0
    },
    "taxExcludedAmount": 0,
    "shippingAmount": 0,
    "shippingVat": {
      "id": 19381,
      "rate": 20,
      "region": "FR",
      "label": "20.0% - FR",
      "default": true
    },
    "taxAmount": 0,
    "balance": 0,
    "taxIncludedAmount": 0,
    "headerNotes": null,
    "footerNotes": null,
    "vendorReference": null,
    "pdfUrl": "/v1/saleinvoices/download/222218",
    "region": "FR"
  }
}