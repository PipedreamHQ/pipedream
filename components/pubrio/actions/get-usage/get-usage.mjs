import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-usage",
  name: "Get Usage",
  description: "Get your Pubrio account usage statistics. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/profile/profile-usage)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.getUsage({
      $,
    });
    $.export("$summary", "Successfully retrieved usage statistics");
    return response;
  },
};
