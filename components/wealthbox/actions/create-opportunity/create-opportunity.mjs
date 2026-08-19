// x-pd-ai: optimized
import wealthbox from "../../wealthbox.app.mjs";

export default {
  key: "wealthbox-create-opportunity",
  name: "Create Opportunity",
  description: "Create a new opportunity in Wealthbox. Supply an opportunity name, target close date, probability (integer 0–100), amount type and value, and stage ID. Use **List Stage Options** to find valid stage IDs and **List Contact Options** to find the contact ID to link. Example: create opportunity `Q4 AUM Expansion` with probability `75`, amount `50000` of type `AUM`, target close `2026-12-31 10:00 AM -0500`; returns the opportunity object including `id`, `name`, `stage`, `probability`, `target_close`, and `amounts`. [See the documentation](https://dev.wealthbox.com/#opportunities-retrieve-all-opportunities-post)",
  version: "0.0.3",
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
      label: "Opportunity Name",
      description: "The name of the opportunity being created. Example: `Q4 AUM Expansion`.",
    },
    targetClose: {
      type: "string",
      label: "Target Close",
      description: "A string representing the date/time when the opportunity should close. Example `2015-05-24 10:00 AM -0400`",
    },
    probability: {
      type: "string",
      label: "Probability",
      description: "An integer (0–100) representing the percentage chance the opportunity will close. Example: `75` for 75% probability.",
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
      description: "The amount in dollars as a numeric string. Example: `50000` for $50,000.",
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
        probability: Number(this.probability),
        amounts: [
          {
            amount: Number(this.amountValue),
            kind: this.amountType,
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
