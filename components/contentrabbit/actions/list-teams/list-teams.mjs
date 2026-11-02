import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-list-teams",
  name: "List Teams",
  description: "List teams visible to the API key. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    contentRabbitApp,
  },
  async run({ $ }) {
    const response = await this.contentRabbitApp.listTeams({
      $,
    });
    $.export("$summary", `Retrieved ${response.data?.length ?? 0} teams`);
    return response;
  },
};
