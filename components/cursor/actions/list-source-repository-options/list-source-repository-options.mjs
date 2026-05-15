import cursor from "../../cursor.app.mjs";

export default {
  key: "cursor-list-source-repository-options",
  name: "List Source Repository Options",
  description: "Retrieves available options for the Source Repository field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cursor,
  },
  async run({ $ }) {
    const options = await cursor.propDefinitions.sourceRepository.options.call(this.cursor);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
