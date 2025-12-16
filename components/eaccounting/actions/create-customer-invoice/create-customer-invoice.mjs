import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-create-customer-invoice",
  name: "Create Customer Invoice",
  description: "Creates a new customer invoice. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    data: {
      type: "object",
      label: "Invoice Data",
      description: "The customer invoice data as a JSON object. [See the API documentation](https://developer.vismaonline.com) for the complete schema.",
    },
    rotReducedAutomaticDistribution: {
      type: "boolean",
      label: "ROT Reduced Automatic Distribution",
      description: "Used for the automatic distribution per person of the ROT reduced invoicing amount",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.createCustomerInvoice({
      $,
      data: this.data,
      params: {
        rotReducedAutomaticDistribution: this.rotReducedAutomaticDistribution,
      },
    });
    $.export("$summary", `Successfully created customer invoice with ID ${response.id || "N/A"}`);
    return response;
  },
};
