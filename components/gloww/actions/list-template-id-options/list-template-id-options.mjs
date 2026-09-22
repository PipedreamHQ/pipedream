import gloww from "../../gloww.app.mjs";

export default {
  key: "gloww-list-template-id-options",
  name: "List Template Id Options",
  description: "Retrieves available options for the Template Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gloww,
  },
  async run({ $ }) {
    const options = await gloww.propDefinitions.templateId.options.call(this.gloww);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
