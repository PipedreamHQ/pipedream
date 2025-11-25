import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-knowledge-bases",
  name: "List Knowledge Bases",
  description: "List the knowledge bases of the company. [See the documentation](https://dev.frontapp.com/reference/list-knowledge-bases)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    frontapp,
  },
  async run({ $ }) {
    const response = await this.frontapp.listKnowledgeBases({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response._results.length} knowledge bases`);

    return response._results;
  },
};
