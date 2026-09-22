import doppler_marketing_automation from "../../doppler_marketing_automation.app.mjs";

export default {
  key: "doppler_marketing_automation-list-list-id-options",
  name: "List List ID Options",
  description: "Retrieves available options for the List ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    doppler_marketing_automation,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await doppler_marketing_automation.propDefinitions.listId.options
      .call(this.doppler_marketing_automation, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
