import sifter from "../../sifter.app.mjs";

export default {
  key: "sifter-list-project-id-options",
  name: "List Project Id Options",
  description: "Retrieves available options for the Project Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sifter,
  },
  async run({ $ }) {
    const options = await sifter.propDefinitions.projectId.options.call(this.sifter);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
