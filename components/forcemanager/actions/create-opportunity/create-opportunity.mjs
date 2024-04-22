import forcemanager from "../../forcemanager.app.mjs";

export default {
  key: "forcemanager-create-opportunity",
  name: "Create Opportunity",
  description: "Creates a new business opportunity in ForceManager. [See the documentation](https://docs.forcemanager.net/api/)",
  version: "0.0.1",
  type: "action",
  props: {
    forcemanager,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the business opportunity",
    },
    account: {
      type: "string",
      label: "Account",
      description: "Account associated with the business opportunity",
    },
    estimatedCloseDate: {
      type: "string",
      label: "Estimated Close Date",
      description: "Estimated date for the closure of the business opportunity",
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "Stage of the business opportunity",
      optional: true,
    },
    probability: {
      type: "integer",
      label: "Probability",
      description: "Probability of success for the business opportunity",
      optional: true,
    },
    revenue: {
      type: "integer",
      label: "Revenue",
      description: "Estimated revenue from the business opportunity",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.forcemanager.createBusinessOpportunity(
      this.name,
      this.account,
      this.estimatedCloseDate,
      this.stage,
      this.probability,
      this.revenue,
    );
    $.export("$summary", `Successfully created opportunity: ${this.name}`);
    return response;
  },
};
