import smartroutes from "../../smartroutes.app.mjs";

export default {
  key: "smartroutes-list-custom-fields-options",
  name: "List Custom Fields Options",
  description: "Retrieves available options for the Custom Fields field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartroutes,
  },
  async run({ $ }) {
    const options = await smartroutes.propDefinitions.customFields.options
      .call(this.smartroutes);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
