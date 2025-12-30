import chargekeep from "../../chargekeep.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "chargekeep-create-invoice",
  name: "Create Invoice",
  description: "Create a new invoice in Chargekeep. [See the documentation](https://crm.chargekeep.com/app/api/swagger)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    chargekeep,
    contactId: {
      propDefinition: [
        chargekeep,
        "contactId",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the invoice",
      options: constants.INVOICE_STATUS_OPTIONS,
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the invoice in the format YYYY-MM-DD",
    },
    currencyId: {
      propDefinition: [
        chargekeep,
        "currencyId",
      ],
    },
    productCodes: {
      propDefinition: [
        chargekeep,
        "productCodes",
      ],
      reloadProps: true,
    },
  },
  additionalProps() {
    const props = {};
    if (!this.productCodes?.length) {
      return props;
    }
    for (const productCode of this.productCodes) {
      props[`${productCode}_quantity`] = {
        type: "string",
        label: `Quantity for Product ${productCode}`,
        description: `The quantity of the product ${productCode} to add to the invoice`,
      };
      props[`${productCode}_rate`] = {
        type: "string",
        label: `Rate for Product ${productCode}`,
        description: `The rate of the product ${productCode} to add to the invoice`,
      };
      props[`${productCode}_unit`] = {
        type: "string",
        label: `Unit for Product ${productCode}`,
        description: `The unit of the product ${productCode} to add to the invoice`,
        options: constants.UNIT_OPTIONS,
      };
      props[`${productCode}_sortOrder`] = {
        type: "integer",
        label: `Sort Order for Product ${productCode}`,
        description: `The sort order of the product ${productCode} to add to the invoice`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const lines = [];
    let grandTotal = 0;
    for (const productCode of this.productCodes) {
      const total = parseFloat(this[`${productCode}_quantity`]) * parseFloat(this[`${productCode}_rate`]);
      lines.push({
        productCode,
        quantity: parseFloat(this[`${productCode}_quantity`]),
        rate: parseFloat(this[`${productCode}_rate`]),
        total,
        unit: this[`${productCode}_unit`],
        sortOrder: this[`${productCode}_sortOrder`],
      });
      grandTotal += total;
    }
    const response = await this.chargekeep.createInvoice({
      $,
      data: {
        contactId: this.contactId,
        status: this.status,
        date: this.date,
        currencyId: this.currencyId,
        lines,
        grandTotal,
      },
    });

    $.export("$summary", `Successfully created invoice with ID ${response.result}.`);
    return response;
  },
};
