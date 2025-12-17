import app from "../../firmao.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "firmao-create-offer",
  name: "Create Offer",
  description: "Create a new quote/offer. [See the documentation](https://firmao.net/API-Documentation_EN.pdf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    number: {
      type: "string",
      label: "Unique Number",
      description: "Unique number of the offer.",
    },
    type: {
      type: "string",
      label: "Offer Type",
      description: "Type of the offer.",
      options: constants.OFFER_TYPE,
    },
    mode: {
      type: "string",
      label: "Offer Mode",
      description: "Mode of the offer.",
      options: constants.OFFER_MODE,
    },
    offerDate: {
      type: "string",
      label: "Offer Date",
      description: "Date of the offer. e.g `2012-07-17T00:00:00+02:00`",
    },
    netPrice: {
      type: "string",
      label: "Net Price",
      description: "Net price of the offer.",
      optional: true,
    },
    grossPrice: {
      type: "string",
      label: "Gross Price",
      description: "Gross price of the offer.",
      optional: true,
    },
    vatPrice: {
      type: "string",
      label: "VAT Price",
      description: "Value Added Tax price of the offer.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency of the offer.",
      options: constants.OFFER_CURRENCY,
      optional: true,
    },
    validFrom: {
      type: "string",
      label: "Valid From",
      description: "Date from which the offer is valid. e.g `2012-07-17T00:00:00+02:00`",
      optional: true,
    },
    offerStatus: {
      type: "string",
      label: "Offer Status",
      description: "Status of the offer.",
      options: constants.OFFER_STATUS,
      optional: true,
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "Payment date of the offer. e.g `2012-07-17T00:00:00+02:00`",
      optional: true,
    },
    customerAddressPostCode: {
      type: "string",
      label: "Customer Address Post Code",
      description: "Post code of the customer's address.",
      optional: true,
    },
    daysToDueDate: {
      type: "integer",
      label: "Days To Due Date",
      description: "Number of days to the due date of the offer.",
      optional: true,
    },
    customer: {
      type: "string",
      label: "Customer",
      description: "Customer ID to be added in an offer",
      optional: true,
      propDefinition: [
        app,
        "customers",
      ],
    },
    customerAddressCity: {
      type: "string",
      label: "Customer Address City",
      description: "City of the customer's address.",
      optional: true,
    },
    customerAddressCountry: {
      type: "string",
      label: "Customer Address Country",
      description: "Country of the customer's address.",
      optional: true,
    },
    customerAddressStreet: {
      type: "string",
      label: "Customer Address Street",
      description: "Street of the customer's address.",
      optional: true,
    },
    nipNumber: {
      type: "string",
      label: "NIP Number",
      description: "NIP number of the customer.",
      optional: true,
    },
    issuingPerson: {
      type: "string",
      label: "Issuing Person",
      description: "Person issuing the offer.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      "nettoPrice": this.netPrice,
      "bruttoPrice": this.grossPrice,
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
