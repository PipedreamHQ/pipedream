import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-create-voucher",
  name: "Create Voucher",
  description: "Creates a new voucher. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    data: {
      type: "object",
      label: "Voucher Data",
      description: "The voucher data as a JSON object. [See the API documentation](https://developer.vismaonline.com) for the complete schema.",
    },
    useAutomaticVatCalculation: {
      type: "boolean",
      label: "Use Automatic VAT Calculation",
      description: "Set to true and specify the sales or purchase gross amount and VAT rows will be added automatically. Default: false",
      optional: true,
    },
    useDefaultVatCodes: {
      type: "boolean",
      label: "Use Default VAT Codes",
      description: "Set to false to override default VAT codes on all rows in the request. Default: true",
      optional: true,
    },
    useDefaultVoucherSeries: {
      type: "boolean",
      label: "Use Default Voucher Series",
      description: "Set to false to override default voucher series. Default: true",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.createVoucher({
      $,
      data: this.data,
      params: {
        useAutomaticVatCalculation: this.useAutomaticVatCalculation,
        useDefaultVatCodes: this.useDefaultVatCodes,
        useDefaultVoucherSeries: this.useDefaultVoucherSeries,
      },
    });
    $.export("$summary", `Successfully created voucher with ID ${response.id || "N/A"}`);
    return response;
  },
};
