import app from "../../quaderno.app.mjs";
import constants from "../../common/constants.mjs";

const { SEP } = constants;

export default {
  props: {
    app,
    firstName: {
      description: "The customer's first name who will be billed.",
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      description: "The customer's last name who will be billed.",
      propDefinition: [
        app,
        "lastName",
      ],
    },
    dueDate: {
      propDefinition: [
        app,
        "dueDate",
      ],
    },
    currency: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    recurringPeriod: {
      propDefinition: [
        app,
        "recurringPeriod",
      ],
    },
    recurringFrequency: {
      propDefinition: [
        app,
        "recurringFrequency",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    postalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
    },
    region: {
      propDefinition: [
        app,
        "region",
      ],
    },
    streetLine1: {
      propDefinition: [
        app,
        "streetLine1",
      ],
    },
    subject: {
      propDefinition: [
        app,
        "subject",
      ],
    },
    howManyItems: {
      propDefinition: [
        app,
        "howManyItems",
      ],
    },
  },
  additionalProps() {
    return Array.from({
      length: this.howManyItems,
    }).reduce((props, _, idx) => {
      const counter = idx + 1;
      const item = `item${counter}`;
      const label = `Item ${counter}:`;
      const description = `${item}${SEP}description`;
      const discountRate = `${item}${SEP}discountRate`;
      const productCode = `${item}${SEP}productCode`;
      const quantity = `${item}${SEP}quantity`;
      const totalAmount = `${item}${SEP}totalAmount`;
      const unitPrice = `${item}${SEP}unitPrice`;
      return {
        ...props,
        [description]: {
          type: "string",
          label: `${label} Description`,
          description: "The description of the item.",
          optional: true,
        },
        [discountRate]: {
          type: "string",
          label: `${label} Discount Rate`,
          description: "Discount percent out of 100, if applicable.",
          optional: true,
        },
        [productCode]: {
          type: "string",
          label: `${label} Product Code`,
          description: "The SKU of the Quaderno **Product** being invoiced. Use this attribute if you want to track your sales per product.",
          optional: true,
        },
        [quantity]: {
          type: "integer",
          label: `${label} Quantity`,
          description: "The quantity of the item.",
          optional: true,
          default: 1,
        },
        [totalAmount]: {
          type: "string",
          label: `${label} Total Amount`,
          description: "The total amount to be charged after discounts and taxes. Required if **Unit Price** is not passed.",
          optional: true,
        },
        [unitPrice]: {
          type: "string",
          label: `${label} Unit Price`,
          description: "The unit price of the item before any discount or tax is applied. Required if **Total Amount** is not passed.",
          optional: true,
        },
      };
    }, {});
  },
  methods: {
    getItems(length) {
      return Array.from({
        length,
      }).map((_, idx) => {
        const counter = idx + 1;
        const item = `item${counter}`;
        const description = this[`${item}${SEP}description`];
        const discountRate = this[`${item}${SEP}discountRate`];
        const productCode = this[`${item}${SEP}productCode`];
        const quantity = this[`${item}${SEP}quantity`];
        const totalAmount = this[`${item}${SEP}totalAmount`];
        const unitPrice = this[`${item}${SEP}unitPrice`];
        return {
          description,
          discount_rate: discountRate,
          product_code: productCode,
          quantity,
          total_amount: totalAmount,
          unit_price: unitPrice,
        };
      });
    },
  },
};
