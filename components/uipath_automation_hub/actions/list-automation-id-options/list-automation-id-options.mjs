import uipath_automation_hub from "../../uipath_automation_hub.app.mjs";

export default {
  key: "uipath_automation_hub-list-automation-id-options",
  name: "List Idea Id Options",
  description: "Retrieves available options for the Idea Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    uipath_automation_hub,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await uipath_automation_hub.propDefinitions.automationId.options
      .call(this.uipath_automation_hub, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
