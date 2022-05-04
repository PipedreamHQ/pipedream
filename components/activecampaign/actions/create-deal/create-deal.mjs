// legacy_hash_id: a_Mdi7Jj
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-create-deal",
  name: "Create Deal",
  description: "Creates a new deal.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    title: {
      type: "string",
      description: "Deal's title.",
    },
    value: {
      type: "integer",
      description: "Deal's value in cents. (i.e. $456.78 => 45678). Must be greater than or equal to zero.",
    },
    currency: {
      type: "string",
      description: "Deal's currency in 3-digit ISO format, lowercased.",
    },
    description: {
      type: "string",
      description: "Deal's description.",
      optional: true,
    },
    account: {
      type: "string",
      description: "Deal's account id.",
      optional: true,
    },
    contact: {
      type: "string",
      description: "Deal's primary contact's id.",
      optional: true,
    },
    group: {
      type: "string",
      description: "Deal's pipeline id. Required if `deal.stage` is not provided. If `deal.group` is not provided, the stage's pipeline will be assigned to the deal automatically.",
      optional: true,
    },
    stage: {
      type: "string",
      description: "Deal's stage id. Required if `deal.group` is not provided. If `deal.stage` is not provided, the deal will be assigned with the first stage in the pipeline provided in `deal.group`.",
      optional: true,
    },
    owner: {
      type: "string",
      description: "Deal's owner id. Required if pipeline's auto-assign option is disabled.",
      optional: true,
    },
    percent: {
      type: "integer",
      description: "Deal's percentage.",
      optional: true,
    },
    status: {
      type: "integer",
      description: "Deal's status. Valid values:\n* `0` - Open\n* `1` - Won\n* `2` - Lost",
      optional: true,
    },
    fields: {
      type: "any",
      description: "Deal's custom field values [{customFieldId, fieldValue}]",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#create-a-deal-new

    if (!this.title || !this.value || !this.currency) {
      throw new Error("Must provide title, value, and currency parameters.");
    }

    const config = {
      method: "post",
      url: `${this.activecampaign.$auth.base_url}/api/3/deals`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
      data: {
        deal: {
          title: this.title,
          description: this.description,
          account: this.account,
          contact: this.contact,
          value: parseInt(this.value),
          currency: this.currency,
          group: this.group,
          stage: this.stage,
          owner: this.owner,
          percent: parseInt(this.percent),
          status: parseInt(this.status),
          fields: this.fields,
        },
      },
    };
    return await axios($, config);
  },
};
