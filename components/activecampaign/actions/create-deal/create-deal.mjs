import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-create-deal",
  name: "Create Deal",
  description: "Creates a new deal. See the docs [here](https://developers.activecampaign.com/reference/create-a-deal-new).",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    activecampaign,
    title: {
      type: "string",
      label: "Title",
      description: "Deal's title.",
    },
    value: {
      type: "integer",
      label: "Value",
      description: "Deal's value in cents. (i.e. $456.78 => 45678). Must be greater than or equal to zero.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Deal's currency in 3-digit ISO format, lowercased.",
    },
    group: {
      type: "string",
      label: "Group",
      description: "Deal's pipeline id. Required if `deal.stage` is not provided. If `deal.group` is not provided, the stage's pipeline will be assigned to the deal automatically.",
      optional: true,
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "Deal's stage id. Required if `deal.group` is not provided. If `deal.stage` is not provided, the deal will be assigned with the first stage in the pipeline provided in `deal.group`.",
      optional: true,
    },
    owner: {
      type: "string",
      label: "Owner",
      description: "Deal's owner id. Required if pipeline's auto-assign option is disabled.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Deal's description.",
      optional: true,
    },
    account: {
      type: "string",
      label: "Account",
      description: "Deal's account id.",
      optional: true,
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "Deal's primary contact's id.",
      optional: true,
    },
    percent: {
      type: "integer",
      label: "Percent",
      description: "Deal's percentage.",
      optional: true,
    },
    status: {
      propDefinition: [
        activecampaign,
        "status",
      ],
    },
    fields: {
      propDefinition: [
        activecampaign,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const {
      title,
      value,
      currency,
      group,
      stage,
      owner,
      description,
      account,
      contact,
      percent,
      status,
      fields,
    } = this;

    let parsedFields;
    try {
      parsedFields = fields?.map(JSON.parse);
    } catch (error) {
      throw new Error("Syntax error in `Fields` property");
    }

    const response = await this.activecampaign.createDeal({
      data: {
        deal: {
          title,
          description,
          account,
          contact,
          value,
          currency,
          group,
          stage,
          owner,
          percent,
          status,
          fields: parsedFields,
        },
      },
    });

    $.export("$summary", `Successfully created a deal with ID ${response.deal.id}`);

    return response;
  },
};
