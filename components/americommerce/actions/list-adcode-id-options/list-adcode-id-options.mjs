import americommerce from "../../americommerce.app.mjs";

export default {
  key: "americommerce-list-adcode-id-options",
  name: "List Adcode ID Options",
  description: "Retrieves available options for the Adcode ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    americommerce,
  },
  async run({ $ }) {
    const options = await americommerce.propDefinitions.adcodeId.options
      .call(this.americommerce);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
