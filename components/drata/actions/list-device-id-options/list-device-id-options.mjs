import drata from "../../drata.app.mjs";

export default {
  key: "drata-list-device-id-options",
  name: "List Device ID Options",
  description: "Retrieves available options for the Device ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    drata,
  },
  async run({ $ }) {
    const options = await drata.propDefinitions.deviceId.options.call(this.drata, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
