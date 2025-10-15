import activecampaign from "../../activecampaign.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "activecampaign-update-deal",
  name: "Update Deal",
  description: "Updates an existing deal. See the docs [here](https://developers.activecampaign.com/reference/update-a-deal-new).",
  version: "0.2.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    activecampaign,
    dealId: {
      type: "string",
      label: "Deal ID",
      description: "Id of the deal to update.",
      propDefinition: [
        activecampaign,
        "deals",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Deal's title.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Deal's description.",
      optional: true,
    },
    account: {
      type: "string",
      label: "Account ID",
      description: "Deal's account id.",
      optional: true,
    },
    contact: {
      type: "string",
      label: "Contact ID",
      description: "Deal's primary contact id.",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "Deal's value in cents. (i.e. $456.78 => 45678). Must be greater than or equal to zero. int32 datatype.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Deal's currency in 3-digit ISO format, lowercased.",
      optional: true,
    },
    group: {
      type: "string",
      label: "Group",
      description: "Deal's pipeline id. Deal's stage or `deal.stage` should belong to `deal.group`.",
      optional: true,
    },
    stage: {
      type: "string",
      label: "Stage",
      description: "Deal's stage id. `deal.stage` should belong to Deal's pipeline or `deal.group`.",
      optional: true,
    },
    owner: {
      type: "string",
      label: "Owner",
      description: "Deal's owner id.",
      optional: true,
    },
    percent: {
      type: "string",
      label: "Percent",
      description: "Deal's percentage. int32 datatype.",
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
      dealId,
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
      throw new ConfigurationError("Syntax error in `Fields` property");
    }

    const response = await this.activecampaign.createDeal({
      dealId,
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

    $.export("$summary", `Successfully updated a deal with ID ${response.deal.id}`);

    return response;
  },
};
