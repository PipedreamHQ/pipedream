import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-create-supplier-invoice",
  name: "Create Supplier Invoice",
  description: "Creates a new supplier invoice. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    data: {
      type: "object",
      label: "Invoice Data",
      description: "The supplier invoice data as a JSON object. [See the API documentation](https://developer.vismaonline.com) for the complete schema.",
    },
    useDefaultVatCodes: {
      type: "boolean",
      label: "Use Default VAT Codes",
      description: "Use default VAT codes",
      optional: true,
    },
    calculateVatOnCostAccounts: {
      type: "boolean",
      label: "Calculate VAT on Cost Accounts",
      description: "Calculate VAT on cost accounts automatically",
      optional: true,
    },
    duplicateCheckExtendedValidation: {
      type: "boolean",
      label: "Duplicate Check Extended Validation",
      description: "Check if the invoice is duplicate",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.createSupplierInvoice({
      $,
      data: this.data,
      params: {
        useDefaultVatCodes: this.useDefaultVatCodes,
        calculateVatOnCostAccounts: this.calculateVatOnCostAccounts,
        duplicateCheckExtendedValidation: this.duplicateCheckExtendedValidation,
      },
    });
    $.export("$summary", `Successfully created supplier invoice with ID ${response.id || "N/A"}`);
    return response;
  },
};
