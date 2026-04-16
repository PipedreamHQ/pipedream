import app from "../../apollo_io_oauth.app.mjs";

export default {
  key: "apollo_io_oauth-get-opportunity",
  name: "Get Opportunity",
  description:
    "Fetches a single opportunity (deal) by ID with full"
    + " details including name, amount, stage, close date,"
    + " owner, and linked account."
    + " Use **Create or Update Opportunity** to modify it after"
    + " retrieval."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/get-opportunity)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity to retrieve.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getOpportunity({
      $,
      opportunityId: this.opportunityId,
    });

    const opp = response.opportunity || response;

    $.export(
      "$summary",
      `Retrieved opportunity ${opp.id}: ${opp.name || "Unnamed"}`,
    );

    return opp;
  },
};
