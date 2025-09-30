import companyhub from "../../companyhub.app.mjs";

export default {
  key: "companyhub-create-deal",
  name: "Create Deal",
  description: "Creates a new deal. [See the documentation](https://companyhub.com/docs/api-documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    companyhub,
    name: {
      type: "string",
      label: "Deal Name",
      description: "The name of the deal",
    },
    stage: {
      type: "string",
      label: "Deal Stage",
      description: "The stage of the deal",
      options: [
        "Prospecting",
        "Qualification",
        "Discussion",
        "Proposal",
        "Review",
        "Closed Won",
        "Closed Lost",
      ],
    },
    companyId: {
      propDefinition: [
        companyhub,
        "companyId",
      ],
    },
    contactId: {
      propDefinition: [
        companyhub,
        "contactId",
      ],
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount of the deal",
      optional: true,
    },
    closeDate: {
      type: "string",
      label: "Expected Close Date",
      description: "The expected close date of the deal in ISO-8601 format. E.g. `2025-03-14T00:00:00`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.companyhub.createDeal({
      $,
      data: {
        Name: this.name,
        Company: this.companyId,
        Contact: this.contactId,
        Stage: this.stage,
        Amount: this.amount,
        CloseDate: this.closeDate,
      },
    });
    if (response.Success) {
      $.export("$summary", `Successfully created deal with ID: ${response.Id}`);
    }
    return response;
  },
};
