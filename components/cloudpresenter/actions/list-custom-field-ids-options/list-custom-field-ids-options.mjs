import cloudpresenter from "../../cloudpresenter.app.mjs";

export default {
  key: "cloudpresenter-list-custom-field-ids-options",
  name: "List Custom Field IDs Options",
  description: "Retrieves available options for the Custom Field IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cloudpresenter,
  },
  async run({ $ }) {
    const options = await cloudpresenter.propDefinitions.customFieldIds.options
      .call(this.cloudpresenter);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
