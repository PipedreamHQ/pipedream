import crove_app from "../../crove_app.app.mjs";

export default {
  key: "crove_app-list-template-id-options",
  name: "List Template Options",
  description: "Retrieves available options for the Template field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    crove_app,
  },
  async run({ $ }) {
    const options = await crove_app.propDefinitions.template_id.options.call(this.crove_app);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
