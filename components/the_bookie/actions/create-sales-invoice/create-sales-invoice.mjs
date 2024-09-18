import theBookie from "../../the_bookie.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "the_bookie-create-sales-invoice",
  name: "Create Sales Invoice",
  description: "Creates a new sales invoice. [See the documentation](https://app.thebookie.nl/nl/help/category/developers/)",
  version: "0.0.1",
  type: "action",
  props: {
    theBookie,
    invoiceNumber: {
      propDefinition: [
        theBookie,
        "invoiceNumber",
      ],
    },
    clientIdentifier: {
      propDefinition: [
        theBookie,
        "clientIdentifier",
      ],
    },
    productServiceDetails: {
      propDefinition: [
        theBookie,
        "productServiceDetails",
      ],
    },
    appliedDiscounts: {
      propDefinition: [
        theBookie,
        "appliedDiscounts",
        {
          optional: true,
        },
      ],
    },
    taxInformation: {
      propDefinition: [
        theBookie,
        "taxInformation",
        {
          optional: true,
        },
      ],
    },
    dueDate: {
      propDefinition: [
        theBookie,
        "dueDate",
        {
          optional: true,
        },
      ],
    },
    paymentTerms: {
      propDefinition: [
        theBookie,
        "paymentTerms",
        {
          optional: true,
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.theBookie.createInvoice({
      invoiceNumber: this.invoiceNumber,
      clientIdentifier: this.clientIdentifier,
      productServiceDetails: this.productServiceDetails,
      appliedDiscounts: this.appliedDiscounts,
      taxInformation: this.taxInformation,
      dueDate: this.dueDate,
      paymentTerms: this.paymentTerms,
    });

    $.export("$summary", `Successfully created invoice with number ${response.invoiceNumber}`);
    return response;
  },
};
