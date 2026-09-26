import orshot from "../../orshot.app.mjs";

export default {
  key: "orshot-list-social-accounts",
  name: "List Social Accounts",
  description: "List the social accounts connected to your Orshot workspace, with the IDs used for publishing. [See the documentation](https://orshot.com/docs/api-reference/social-accounts-list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    orshot,
    includeHealth: {
      type: "boolean",
      label: "Include Health",
      description: "Also return `requires_reconnect` for each account (e.g. expired tokens)",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.includeHealth) {
      params.include_health = true;
    }
    const response = await this.orshot.listSocialAccounts({
      $,
      params,
    });
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Retrieved ${count} social account${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
