// legacy_hash_id: a_Q3ixw3
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-update-deal",
  name: "Update Deal",
  description: "Updates an existing deal.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    deal_id: {
      type: "string",
      description: "Id of the deal to update.",
    },
    title: {
      type: "string",
      description: "Deal's title.",
      optional: true,
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
      description: "Deal's primary contact id.",
      optional: true,
    },
    value: {
      type: "string",
      description: "Deal's value in cents. (i.e. $456.78 => 45678). Must be greater than or equal to zero. int32 datatype.",
      optional: true,
    },
    currency: {
      type: "string",
      description: "Deal's currency in 3-digit ISO format, lowercased.",
      optional: true,
    },
    group: {
      type: "string",
      description: "Deal's pipeline id. Deal's stage or `deal.stage` should belong to `deal.group`.",
      optional: true,
    },
    stage: {
      type: "string",
      description: "Deal's stage id. `deal.stage` should belong to Deal's pipeline or `deal.group`.",
      optional: true,
    },
    owner: {
      type: "string",
      description: "Deal's owner id.",
      optional: true,
    },
    percent: {
      type: "string",
      description: "Deal's percentage. int32 datatype.",
      optional: true,
    },
    status: {
      type: "string",
      description: "Deal's status. Available values:\n* `0` - Open\n* `1` - Won\n* `2` - Lost",
      optional: true,
      options: [
        "0",
        "1",
        "2",
      ],
    },
    fields: {
      type: "any",
      description: "Deal's custom field values [{customFieldId, fieldValue}].",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#update-a-deal-new

    if (!this.deal_id) {
      throw new Error("Must provide deal_id parameter.");
    }

    const config = {
      method: "put",
      url: `${this.activecampaign.$auth.base_url}/api/3/deals/${this.deal_id}`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
      data: {
        deal: {
          title: this.title,
          description: this.description,
          account: this.account,
          contact: this.contact,
          value: this.value,
          currency: this.currency,
          group: this.group,
          stage: this.stage,
          owner: this.owner,
          percent: this.percent,
          status: this.status,
          fields: this.fields,
        },
      },
    };
    return await axios($, config);
  },
};
