import navigatr from "../../navigatr.app.mjs";

export default {
  key: "navigatr-list-provider-id-options",
  name: "List Provider ID Options",
  description: "Retrieves available options for the Provider ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    navigatr,
  },
  async run({ $ }) {
    const options = await navigatr.propDefinitions.providerId.options.call(this.navigatr);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
