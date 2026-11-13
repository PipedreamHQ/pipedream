import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-list-campaign-id-options",
  name: "List Campaign Id Options",
  description: "Retrieves available options for the Campaign Id field.",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linkedin,
    adAccountId: {
      propDefinition: [
        linkedin,
        "adAccountId",
      ],
      description: "The numeric id of the ad account whose campaigns to list, e.g. `123456789` (not the `urn:li:sponsoredAccount:…` URN). Use **List Ad Account Id Options** to find ids.",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await linkedin.propDefinitions.campaignId.options.call(this.linkedin, {
      page: this.page,
      adAccountId: this.adAccountId,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
