import gocanvas from "../../gocanvas.app.mjs";

export default {
  key: "gocanvas-list-form-options",
  name: "List Form Options",
  description: "Retrieves available options for the Form field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gocanvas,
  },
  async run({ $ }) {
    const options = await gocanvas.propDefinitions.form.options.call(this.gocanvas);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
