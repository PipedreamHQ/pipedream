import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-message-templates",
  name: "List Message Templates",
  description: "List the message templates. [See the documentation](https://dev.frontapp.com/reference/list-message-templates).",
  version: "0.0.1",
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
      fn: this.frontApp.listMessageTemplates,
      maxResults: this.maxResults,
      $,
    });

    const results = [];
    for await (const item of items) {
      results.push(item);
    }
    $.export("$summary", `Successfully retrieved ${results?.length} message template${results?.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
