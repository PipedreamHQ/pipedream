import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-conversations",
  name: "List Conversations",
  description: "List conversations in the company. [See the documentation](https://dev.frontapp.com/reference/list-conversations)",
  version: "0.0.3",
  type: "action",
  props: {
    frontApp,
    maxResults: {
      propDefinition: [
        frontApp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const items = this.frontApp.paginate({
      fn: this.frontApp.listConversations,
      maxResults: this.maxResults,
      $,
    });

    const results = [];
    for await (const item of items) {
      results.push(item);
    }

    $.export("$summary", `Successfully retrieved ${results.length} conversation${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
