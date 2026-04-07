import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-get-usage",
  name: "Get Usage",
  description: "Get your Pubrio account usage statistics. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  props: {
    pubrio,
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/profile/usage",
      data: {},
    });
    $.export("$summary", "Successfully retrieved usage statistics");
    return response;
  },
};
