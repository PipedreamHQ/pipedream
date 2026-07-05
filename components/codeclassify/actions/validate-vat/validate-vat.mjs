import app from "../../codeclassify.app.mjs";

export default {
  key: "codeclassify-validate-vat",
  name: "Validate EU VAT Numbers",
  description: "Validate one or more EU VAT numbers (format + checksum) with CodeClassify. [See the docs](https://code-classify.com/api/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    vats: {
      type: "string[]",
      label: "VAT Numbers",
      description: "One or more EU VAT numbers, e.g. `IT12345670017`. Up to 100 per call.",
    },
  },
  async run({ $ }) {
    const response = await this.app.validateVat({
      $,
      data: {
        vats: this.vats,
      },
    });
    $.export("$summary", `Validated ${this.vats.length} VAT number${this.vats.length === 1 ? "" : "s"}`);
    return response;
  },
};
