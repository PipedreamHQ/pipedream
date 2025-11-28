import frontApp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-teammates",
  name: "List Teammate",
  description: "List teammates in the company. [See the documentation](https://dev.frontapp.com/reference/list-teammates)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
      fn: this.frontApp.listTeammates,
      maxResults: this.maxResults,
      $,
    });

    const results = [];
    for await (const item of items) {
      results.push(item);
    }

    $.export("$summary", `Successfully retrieved ${results.length} teammate${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
