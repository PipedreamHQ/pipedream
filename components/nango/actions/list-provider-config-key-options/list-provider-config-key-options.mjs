import nango from "../../nango.app.mjs";

export default {
  key: "nango-list-provider-config-key-options",
  name: "List Provider Config Key Options",
  description: "Retrieves available options for the Provider Config Key field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nango,
  },
  async run({ $ }) {
    const options = await nango.propDefinitions.providerConfigKey.options.call(this.nango);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
