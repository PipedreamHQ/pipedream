import app from "../../codeclassify.app.mjs";

export default {
  key: "codeclassify-validate-iban",
  name: "Validate IBANs",
  description: "Validate one or more IBANs with the ISO 13616 MOD-97 checksum and per-country length rules. [See the docs](https://code-classify.com/api/).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    ibans: {
      type: "string[]",
      label: "IBANs",
      description: "One or more IBANs, e.g. `DE89370400440532013000`. Up to 100 per call.",
    },
  },
  async run({ $ }) {
    const response = await this.app.validateIban({
      $,
      data: {
        ibans: this.ibans,
      },
    });
    $.export("$summary", `Validated ${this.ibans.length} IBAN${this.ibans.length === 1 ? "" : "s"}`);
    return response;
  },
};
