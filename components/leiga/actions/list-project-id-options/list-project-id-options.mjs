import leiga from "../../leiga.app.mjs";

export default {
  key: "leiga-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    leiga,
  },
  async run({ $ }) {
    const options = await leiga.propDefinitions.projectId.options.call(this.leiga);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
