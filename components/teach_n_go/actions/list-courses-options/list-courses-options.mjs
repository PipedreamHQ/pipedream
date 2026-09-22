import teach_n_go from "../../teach_n_go.app.mjs";

export default {
  key: "teach_n_go-list-courses-options",
  name: "List Courses Options",
  description: "Retrieves available options for the Courses field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    teach_n_go,
  },
  async run({ $ }) {
    const options = await teach_n_go.propDefinitions.courses.options.call(this.teach_n_go);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
