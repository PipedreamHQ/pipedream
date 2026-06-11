import docsautomator from "../../docsautomator.app.mjs";

export default {
  key: "docsautomator-list-automation-id-options",
  name: "List Automation ID Options",
  description: "Retrieves available options for the Automation ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docsautomator,
  },
  async run({ $ }) {
    const options = await docsautomator.propDefinitions.automationId.options
      .call(this.docsautomator);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
