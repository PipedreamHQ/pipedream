import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-create-opportunity",
  name: "Create Opportunity",
  description: "Creates a new opportunity in Apollo.io. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#create-opportunity)",
  type: "action",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
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
    },
    closedDate: {
      type: "string",
      label: "Closed Date",
      description: "The date the opportunity was closed.",
    },
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
  },
  async run({ $ }) {
    const { opportunity } = await this.app.createOpportunity({
      $,
      data: {
        owner_id: this.ownerId,
        name: this.name,
        amount: this.amount,
        opportunity_stage_id: this.opportunityStageId,
        closed_date: this.closedDate,
        account_id: this.accountId,
      },
    });

    $.export("$summary", `Successfully created opportunity with ID ${opportunity.id}`);

    return opportunity;
  },
};
