import app from "../../firmao.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "firmao-create-offer",
  name: "Create Offer",
  description:
    "Create a new quote/offer. [See the documentation](https://firmao.net/API-Documentation_EN.pdf)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    nettoPrice: {
      type: "string",
      label: "Netto Price",
      description: "Net price of the offer.",
    },
    bruttoPrice: {
      type: "string",
      label: "Brutto Price",
      description: "Gross price of the offer.",
    },
    vatPrice: {
      type: "string",
      label: "VAT Price",
      description: "Value Added Tax price of the offer.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency of the offer.",
      options: constants.OFFER_CURRENCY,
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "Payment date of the offer. e.g `2012-07-17T00:00:00+02:00`",
    },
    offerDate: {
      type: "string",
      label: "Offer Date",
      description: "Date of the offer. e.g `2012-07-17T00:00:00+02:00`",
    },
    validFrom: {
      type: "string",
      label: "Valid From",
      description: "Date from which the offer is valid. e.g `2012-07-17T00:00:00+02:00`",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the offer.",
      options: constants.OFFER_TYPE,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Mode of the offer.",
      options: constants.OFFER_MODE,
    },
    offerStatus: {
      type: "string",
      label: "Offer Status",
      description: "Status of the offer.",
      options: constants.OFFER_STATUS,
    },
    customerAddressPostCode: {
      type: "string",
      label: "Customer Address Post Code",
      description: "Post code of the customer's address.",
    },
    daysToDueDate: {
      type: "integer",
      label: "Days To Due Date",
      description: "Number of days to the due date of the offer.",
    },
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
    },
    customerAddressCity: {
      type: "string",
      label: "Customer Address City",
      description: "City of the customer's address.",
    },
    customerAddressCountry: {
      type: "string",
      label: "Customer Address Country",
      description: "Country of the customer's address.",
    },
    customerAddressStreet: {
      type: "string",
      label: "Customer Address Street",
      description: "Street of the customer's address.",
    },
    nipNumber: {
      type: "string",
      label: "NIP Number",
      description: "NIP number of the customer.",
    },
    issuingPerson: {
      type: "string",
      label: "Issuing Person",
      description: "Person issuing the offer.",
    },
    number: {
      type: "string",
      label: "Number",
      description: "Unique number of the offer.",
    },
  },
  async run({ $ }) {
    const data = {
      "nettoPrice": this.nettoPrice,
      "bruttoPrice": this.bruttoPrice,
      "vatPrice": this.vatPrice,
      "currency": this.currency,
      "paymentType": this.paymentType,
      "paymentDate": this.paymentDate,
      "offerDate": this.offerDate,
      "validFrom": this.validFrom,
      "type": this.type,
      "mode": this.mode,
      "offerStatus": this.offerStatus,
      "customerAddress.postCode": this.customerAddressPostCode,
      "daysToDueDate": this.daysToDueDate,
      "customer": this.customer,
      "customerAddress.city": this.customerAddressCity,
      "customerAddress.country": this.customerAddressCountry,
      "customerAddress.street": this.customerAddressStreet,
      "nipNumber": this.nipNumber,
      "issuingPerson": this.issuingPerson,
      "number": this.number,
    };

    const offer = await this.app.createOffer({
      $,
      data,
    });
    $.export("$summary", "Successfully created offer");

    return offer;
  },
};
