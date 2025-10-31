import economic from "../../e_conomic.app.mjs";

export default {
  key: "e_conomic-create-voucher",
  name: "Create Voucher",
  description: "Creates a new voucher. [See the documentation](https://restdocs.e-conomic.com/#get-journals-journalnumber-vouchers)",
  version: "0.0.{{ts}}",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    economic,
    journalNumber: {
      propDefinition: [
        economic,
        "journalNumber",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.economic.createVoucher({
      $,
      journalNumber: this.journalNumber,
      data: {},
    });
    $.export("$summary", "Successfully created voucher.");
    return response;
  },
};
