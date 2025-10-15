import mocean from "../../mocean_api.app.mjs";

export default {
  key: "mocean_api-get-balance",
  name: "Get Balance",
  description: "Retrieve your current account balance with Mocean API. [See the documentation](https://moceanapi.com/docs/#get-balance)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mocean,
  },
  async run({ $ }) {
    const response = await this.mocean.getBalance({
      $,
    });

    if (response) {
      $.export("$summary", "Successfully retrieved balance.");
    }

    return response;
  },
};
