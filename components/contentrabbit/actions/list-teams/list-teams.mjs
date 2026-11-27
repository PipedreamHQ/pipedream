import contentRabbitApp from "../../contentrabbit.app.mjs";

export default {
  key: "contentrabbit-list-teams",
  name: "List Teams",
  description: "List teams visible to the API key. [See the documentation](https://contentrabbitai.com/api/public/v1/docs#/Teams/listTeams)",
  version: "0.0.1",
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