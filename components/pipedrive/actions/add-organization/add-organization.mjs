// legacy_hash_id: a_WYiEeg
import { axios } from "@pipedream/platform";

export default {
  key: "pipedrive-add-organization",
  name: "Add Organization",
  description: "Adds a new organization.",
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
    name: {
      type: "string",
      description: "Organization name",
    },
    owner_id: {
      type: "integer",
      description: "ID of the user who will be marked as the owner of this organization. When omitted, the authorized user ID will be used.",
      optional: true,
    },
    visible_to: {
      type: "string",
      description: "Visibility of the organization. If omitted, visibility will be set to the default visibility setting of this item type for the authorized user.\n1 - Owner & followers (private)\n3 - Entire company (shared)",
      optional: true,
      options: [
        "1",
        "3",
      ],
    },
    add_time: {
      type: "string",
      description: "Optional creation date & time of the organization in UTC. Requires admin user API token. Format: YYYY-MM-DD HH:MM:SS",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the Pipedrive API docs for Organizations here: https://developers.pipedrive.com/docs/api/v1/#!/Organizations
    const config = {
      method: "post",
      url: `https://${this.companydomain}.pipedrive.com/v1/organizations`,
      data: {
        name: this.name,
        owner_id: this.owner_id,
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
