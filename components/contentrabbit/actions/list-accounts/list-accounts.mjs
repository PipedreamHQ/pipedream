import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-list-accounts",
  name: "List Accounts",
  description: "List all connected social accounts for the team. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    contentRabbitApp,
    platform: {
      propDefinition: [
        contentRabbitApp,
        "platformType",
      ],
      label: "Platform Filter",
      description: "Filter by platform (e.g. `twitter`, `instagram`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.listAccounts({
      $,
      params: {
        platform: this.platform,
      },
    });
    $.export("$summary", `Retrieved ${response.data?.length ?? 0} accounts`);
    return response;
  },
};
