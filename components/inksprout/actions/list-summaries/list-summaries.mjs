import app from "../../inksprout.app.mjs";

export default {
  key: "inksprout-list-summaries",
  name: "List Summaries",
  description: "List all summaries created. [See the docs](https://inksprout.co/docs/index.html#item-2-2).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    offset: {
      type: "integer",
      label: "Offset",
      description: "Offset of the summaries requesting.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { offset } = this;
    const result = await this.app.listSummaries($, offset);
    $.export("$summary", `Successfully listed ${result.summaries.length} summaries`);
    return result;
  },
};
