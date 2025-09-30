import scrapfly from "../../scrapfly.app.mjs";

export default {
  key: "scrapfly-account-info",
  name: "Retrieve Scrapfly Account Info",
  description: "Retrieve current subscription and account usage details from Scrapfly. [See the documentation](https://scrapfly.io/docs/account#api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    scrapfly,
  },
  async run({ $ }) {
    const response = await this.scrapfly.getAccountInfo({
      $,
    });
    $.export("$summary", "Successfully retrieved account information");
    return response;
  },
};
