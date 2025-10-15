import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-create-opportunity",
  name: "Create Opportunity",
  description: "Create a new opportunity. [See the documentation](http://dev.wealthbox.com/#opportunities-collection-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wealthbox,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the opportunity being created",
    },
    targetClose: {
      type: "string",
      label: "Target Close",
      description: "A string representing the date/time when the opportunity should close. Example `2015-05-24 10:00 AM -0400`",
    },
    probability: {
      type: "string",
      label: "Probability",
      description: "A number representing the chance the opportunity will close, as a percentage",
    },
    amountType: {
      type: "string",
      label: "Amount Type",
      description: "The type of amount",
      options: [
        "Fee",
        "Commission",
        "AUM",
        "Other",
      ],
    },
    amountValue: {
      type: "string",
      label: "Amount Value",
      description: "The amount in dollars",
    },
    contactId: {
      propDefinition: [
        wealthbox,
        "contactId",
      ],
      optional: true,
    },
    stage: {
      propDefinition: [
        wealthbox,
        "opportunityStage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.wealthbox.createOpportunity({
      data: {
        name: this.name,
        linked_to: [
          {
            id: this.contactId,
          },
        ],
        stage: this.stage,
        target_close: this.targetClose,
        probability: this.probability,
        amounts: [
          {
            amount: this.amountValue,
            kind: this.amountKind,
          },
        ],
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created opportunity with ID ${response.id}`);
    }

    return response;
  },
};
