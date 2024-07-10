import repliq from "../../repliq.app.mjs";

export default {
  key: "repliq-get-credits-count",
  name: "Get Credits Count",
  description: "Retrieve the total number of credits left for the month. [See the documentation](https://developer.repliq.co/get/g1-credits-count)",
  version: "0.0.1",
  type: "action",
  props: {
    repliq,
  },
  async run({ $ }) {
    const response = await this.repliq.getCreditsCount({
      $,
    });
    $.export("$summary", `Successfully retrieved credits count: ${response.creditsCount}`);
    return response;
  },
};
