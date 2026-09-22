import onepagecrm from "../../onepagecrm.app.mjs";

export default {
  key: "onepagecrm-list-deal-id-options",
  name: "List Deal ID Options",
  description: "Retrieves available options for the Deal ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    onepagecrm,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await onepagecrm.propDefinitions.dealId.options.call(this.onepagecrm, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
