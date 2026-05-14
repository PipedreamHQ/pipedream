import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-object-schema-options",
  name: "List Object Schema Options",
  description: "Retrieves available options for the Object Schema field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
  },
  async run({ $ }) {
    const options = await hubspot.propDefinitions.objectSchema.options.call(this.hubspot);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
