import opsgenie from "../../opsgenie.app.mjs";

export default {
  key: "opsgenie-list-alert-id-options",
  name: "List Alert ID Options",
  description: "Retrieves available options for the Alert ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    opsgenie,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await opsgenie.propDefinitions.alertId.options.call(this.opsgenie, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
