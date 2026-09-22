import gan_ai from "../../gan_ai.app.mjs";

export default {
  key: "gan_ai-list-project-id-options",
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
    gan_ai,
  },
  async run({ $ }) {
    const options = await gan_ai.propDefinitions.projectId.options.call(this.gan_ai);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
