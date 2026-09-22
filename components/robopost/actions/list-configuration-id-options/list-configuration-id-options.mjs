import robopost from "../../robopost.app.mjs";

export default {
  key: "robopost-list-configuration-id-options",
  name: "List Configuration ID Options",
  description: "Retrieves available options for the Configuration ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    robopost,
  },
  async run({ $ }) {
    const options = await robopost.propDefinitions.configurationId.options.call(this.robopost, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
