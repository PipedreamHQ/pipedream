import elorus from "../../elorus.app.mjs";

export default {
  key: "elorus-list-project-options",
  name: "List Project Options",
  description: "Retrieves available options for the Project field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    elorus,
  },
  async run({ $ }) {
    const options = await elorus.propDefinitions.project.options.call(this.elorus);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
