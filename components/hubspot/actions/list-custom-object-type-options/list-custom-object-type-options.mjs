import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-list-custom-object-type-options",
  name: "List Custom Object Type Options",
  description: "Retrieves available options for the Custom Object Type field.",
  version: "0.0.3",
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
    const options = await hubspot.propDefinitions.customObjectType.options.call(this.hubspot);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
