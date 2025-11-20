import economic from "../../e_conomic.app.mjs";

export default {
  key: "e_conomic-create-invoice",
  name: "Create Invoice",
  description: "Creates a new draft invoice. [See the documentation](https://restdocs.e-conomic.com/#post-invoices-drafts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    economic,
    currency: {
      propDefinition: [
        economic,
        "currencyCode",
      ],
    },
    customerNumber: {
      propDefinition: [
        economic,
        "customerNumber",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the invoice in the format YYYY-MM-DD",
    },
    layoutNumber: {
      propDefinition: [
        economic,
        "layoutNumber",
      ],
    },
    paymentTermNumber: {
      propDefinition: [
        economic,
        "paymentTermNumber",
      ],
    },
    recipientNmae: {
      type: "string",
      label: "Recipient Name",
      description: "The name of the recipient of the invoice",
    },
    recipientVatZoneNumber: {
      propDefinition: [
        economic,
        "vatZoneNumber",
      ],
    },
    productNumbers: {
      propDefinition: [
        economic,
        "productNumbers",
      ],
      withLabel: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.productNumbers?.length) {
      return props;
    }
    for (const productNumber of this.productNumbers) {
      props[`${productNumber.value || productNumber}_quantity`] = {
        type: "string",
        label: `Quantity for Product ${productNumber.label || productNumber}`,
        description: `The quantity of the product ${productNumber.label || productNumber} to add to the invoice`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const lines = [];
    for (let i = 0; i < this.productNumbers.length; i++) {
      const productNumber = this.productNumbers[i].value || this.productNumbers[i];
      lines.push({
        lineNumber: i + 1,
        product: {
          productNumber,
        },
        quantity: parseFloat(this[`${productNumber}_quantity`]),
      });
    }

    const response = await this.economic.createDraftInvoice({
      $,
      data: {
        currency: this.currency,
        customer: {
          customerNumber: this.customerNumber,
        },
        date: this.date,
        layout: {
          layoutNumber: this.layoutNumber,
        },
        paymentTerms: {
          paymentTermsNumber: this.paymentTermNumber,
        },
        recipient: {
          name: this.recipientName,
          vatZone: {
            vatZoneNumber: this.recipientVatZoneNumber,
          },
        },
        lines,
      },
    });
    $.export("$summary", "Successfully created invoice.");
    return response;
  },
};
