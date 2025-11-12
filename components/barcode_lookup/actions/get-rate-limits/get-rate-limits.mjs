import app from "../../barcode_lookup.app.mjs";

export default {
  key: "barcode_lookup-get-rate-limits",
  name: "Get Rate Limits",
  description: "Retrieve the current API rate limits for your account. [See the documentation](https://www.barcodelookup.com/api-documentation#endpoints)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getRateLimits({
      $,
    });
    $.export("$summary", "Successfully retrieved the account rate limits");
    return response;
  },
};
