import jobber from "../../jobber.app.mjs";

export default {
  key: "jobber-create-quote",
  name: "Create Quote",
  description: "Generates a new quote for a client's property in Jobber. [See the documentation](https://developer.getjobber.com/docs/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jobber,
    clientId: {
      propDefinition: [
        jobber,
        "clientId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The description of the quote",
    },
    propertyId: {
      propDefinition: [
        jobber,
        "propertyId",
        (c) => ({
          clientId: c.clientId,
        }),
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to the client",
      optional: true,
    },
    saveToProductsAndServices: {
      type: "boolean",
      label: "Save to Products and Services",
      description: "Save a copy of the new line item(s) to products and services for future use",
      default: false,
      optional: true,
    },
    numLineItems: {
      type: "integer",
      label: "Number of Line Items",
      description: "The number of line items to add to this quote",
      min: 1,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.numLineItems) {
      return props;
    }
    for (let i = 1; i <= this.numLineItems; i++) {
      props[`line_${i}_name`] = {
        type: "string",
        label: `Line Item ${i} - Name`,
      };
      props[`line_${i}_description`] = {
        type: "string",
        label: `Line Item ${i} - Description`,
      };
      props[`line_${i}_quantity`] = {
        type: "string",
        label: `Line Item ${i} - Quantity`,
      };
      props[`line_${i}_unitPrice`] = {
        type: "string",
        label: `Line Item ${i} - Unit Price`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      clientId,
      title,
      propertyId,
      message = "",
      saveToProductsAndServices,
      numLineItems,
    } = this;

    let lineItems = "[";
    for (let i = 1; i <= numLineItems; i++) {
      if (i > 1 && i !== numLineItems) {
        lineItems += ", ";
      }
      const nameKey = `line_${i}_name`;
      const descriptionKey = `line_${i}_description`;
      const quantityKey = `line_${i}_quantity`;
      const unitPriceKey = `line_${i}_unitPrice`;
      lineItems += `{name: "${this[nameKey]}", description: "${this[descriptionKey]}", quantity: ${this[quantityKey]}, unitPrice: ${this[unitPriceKey]}, saveToProductsAndServices: ${saveToProductsAndServices}}`;
    }
    lineItems += "]";

    const response = await this.jobber.post({
      $,
      data: {
        query: `mutation CreateQuote {
          quoteCreate(
            attributes: {clientId: "${clientId}", title: "${title}", message: "${message}", 
            lineItems: ${lineItems}, propertyId: "${propertyId}"}
          ) {
            quote {
              id
              title
              client {
                id
              }
            }
          }
        }`,
        operationName: "CreateQuote",
      },
    });
    if (response.errors) {
      throw new Error(response.errors[0].message);
    }
    $.export("$summary", `Successfully created quote with ID: ${response.data.quoteCreate.quote.id}`);
    return response;
  },
};
