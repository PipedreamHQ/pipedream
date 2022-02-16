// legacy_hash_id: a_EViLor
import { axios } from "@pipedream/platform";

export default {
  key: "pipedrive-add-deal",
  name: "Add Deal",
  description: "Adds a new deal.",
  version: "0.1.1",
  type: "action",
  props: {
    pipedrive: {
      type: "app",
      app: "pipedrive",
    },
    companydomain: {
      type: "string",
      description: "Your company name as registered in Pipedrive, which becomes part of Pipedrive API base url.",
    },
    title: {
      type: "string",
      description: "Deal title",
    },
    value: {
      type: "string",
      description: "Value of the deal. If omitted, value will be set to 0.",
      optional: true,
    },
    currency: {
      type: "string",
      description: "Currency of the deal. Accepts a 3-character currency code. If omitted, currency will be set to the default currency of the authorized user.",
      optional: true,
    },
    user_id: {
      type: "integer",
      description: "ID of the user who will be marked as the owner of this deal. If omitted, the authorized user ID will be used.",
      optional: true,
    },
    person_id: {
      type: "integer",
      description: "ID of the person this deal will be associated with",
      optional: true,
    },
    org_id: {
      type: "integer",
      description: "ID of the organization this deal will be associated with",
      optional: true,
    },
    stage_id: {
      type: "integer",
      description: "ID of the stage this deal will be placed in a pipeline (note that you can't supply the ID of the pipeline as this will be assigned automatically based on stage_id). If omitted, the deal will be placed in the first stage of the default pipeline.",
      optional: true,
    },
    status: {
      type: "string",
      description: "open = Open, won = Won, lost = Lost, deleted = Deleted. If omitted, status will be set to open.",
      optional: true,
      options: [
        "open",
        "won",
        "lost",
        "deleted",
      ],
    },
    probability: {
      type: "integer",
      description: "Deal success probability percentage. Used/shown only when deal_probability for the pipeline of the deal is enabled.",
      optional: true,
    },
    lost_reason: {
      type: "string",
      description: "Optional message about why the deal was lost (to be used when status=lost)",
      optional: true,
    },
    visible_to: {
      type: "string",
      description: "Visibility of the deal. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.\n1 - Owner & followers (private)\n3 - Entire company (shared)",
      optional: true,
      options: [
        "1",
        "3",
      ],
    },
    add_time: {
      type: "string",
      description: "Optional creation date & time of the deal in UTC. Requires admin user API token. Format: YYYY-MM-DD HH:MM:SS",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the Pipedrive API docs for Deals here: https://developers.pipedrive.com/docs/api/v1/#!/Deals
    const config = {
      method: "post",
      url: `https://${this.companydomain}.pipedrive.com/v1/deals`,
      data: {
        title: this.title,
        value: this.value,
        currency: this.currency,
        user_id: this.user_id,
        person_id: this.person_id,
        org_id: this.org_id,
        stage_id: this.stage_id,
        status: this.status,
        probability: this.probability,
        lost_reason: this.lost_reason,
        visible_to: this.visible_to,
        add_time: this.add_time,
      },
      headers: {
        Authorization: `Bearer ${this.pipedrive.$auth.oauth_access_token}`,
      },

    };
    return await axios($, config);
  },
};
