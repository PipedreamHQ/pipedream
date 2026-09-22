import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-update-opportunity",
  name: "Update Opportunity",
  description: "Updates a new opportunity in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#update-opportunity)",
  type: "action",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
    },
    ownerId: {
      propDefinition: [
        app,
        "ownerId",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "The name of the opportunity.",
      optional: true,
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount of money involved in the opportunity/deal.",
      optional: true,
    },
    opportunityStageId: {
      propDefinition: [
        app,
        "opportunityStageId",
      ],
      optional: true,
    },
    closedDate: {
      type: "string",
      label: "Closed Date",
      description: "The date the opportunity was closed.",
      optional: true,
    },
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { opportunity } = await this.app.updateOpportunity({
      $,
      opportunityId: this.opportunityId,
      data: {
        owner_id: this.ownerId,
        name: this.name,
        amount: this.amount,
        opportunity_stage_id: this.opportunityStageId,
        closed_date: this.closedDate,
        account_id: this.accountId,
      },
    });

    $.export("$summary", `Successfully updated opportunity with ID ${this.opportunityId}`);

    return opportunity;
  },
};
