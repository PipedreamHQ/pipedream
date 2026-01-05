import app from "../../netsuite.app.mjs";

export default {
  key: "netsuite-get-invoice",
  name: "Get Invoice",
  description: "Retrieves an invoice by ID. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag-invoice)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    invoiceId: {
      propDefinition: [
        app,
        "invoiceId",
      ],
    },
    expandSubResources: {
      propDefinition: [
        app,
        "expandSubResources",
      ],
    },
    simpleEnumFormat: {
      propDefinition: [
        app,
        "simpleEnumFormat",
      ],
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      invoiceId,
      expandSubResources,
      simpleEnumFormat,
      fields,
    } = this;

    const response = await app.getInvoice({
      $,
      invoiceId,
      params: {
        expandSubResources,
        simpleEnumFormat,
        fields,
      },
    });

    $.export("$summary", `Successfully retrieved invoice with ID ${invoiceId}`);
    return response;
  },
};
