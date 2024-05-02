import relavate from "../../relavate.app.mjs";

export default {
  key: "relavate-create-affiliate-lead",
  name: "Create Affiliate Lead",
  description: "This component enables you to create a new affiliate lead for marketing.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    relavate,
    details: {
      type: "string",
      label: "Details",
      description: "The details of the lead",
      required: true,
    },
    followUp: {
      type: "boolean",
      label: "Follow Up",
      description: "Indicates if a follow up interaction is necessary",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.relavate.createAffiliateLead(this.details, this.followUp);
    $.export("$summary", `Created affiliate lead with details: ${this.details}`);
    return response;
  },
};
