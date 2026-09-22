import dropinblog from "../../dropinblog.app.mjs";

export default {
  key: "dropinblog-list-author-id-options",
  name: "List Author ID Options",
  description: "Retrieves available options for the Author ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dropinblog,
  },
  async run({ $ }) {
    const options = await dropinblog.propDefinitions.authorId.options.call(this.dropinblog);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
