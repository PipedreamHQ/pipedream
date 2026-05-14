import ninjaone from "../../ninjaone.app.mjs";

export default {
  key: "ninjaone-list-policy-id-options",
  name: "List Policy ID Options",
  description: "Retrieves available options for the Policy ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ninjaone,
  },
  async run({ $ }) {
    const options = await ninjaone.propDefinitions.policyId.options.call(this.ninjaone);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
