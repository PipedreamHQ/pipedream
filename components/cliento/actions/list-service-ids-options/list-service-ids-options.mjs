import cliento from "../../cliento.app.mjs";

export default {
  key: "cliento-list-service-ids-options",
  name: "List Service IDs Options",
  description: "Retrieves available options for the Service IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cliento,
  },
  async run({ $ }) {
    const options = await cliento.propDefinitions.serviceIds.options.call(this.cliento);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
