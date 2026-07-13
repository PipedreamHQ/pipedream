import pagerduty from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-list-service-id-options",
  name: "List Service ID Options",
  description: "Retrieves available options for the Service ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pagerduty,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await pagerduty.propDefinitions.serviceId.options.call(this.pagerduty, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
