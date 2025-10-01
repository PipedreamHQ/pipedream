import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-get-opportunity",
  name: "Get Opportunity",
  description: "Gets a specific opportunity in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#view-opportunity)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
    },
  },
  async run({ $ }) {
    const { opportunity } = await this.app.getOpportunity({
      $,
      opportunityId: this.opportunityId,
    });

    $.export("$summary", `Successfully fetched the opportunity with Id ${this.opportunityId}.`);

    return opportunity;

  },
};
