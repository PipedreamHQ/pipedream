// legacy_hash_id: a_nji3gl
import { axios } from "@pipedream/platform";

export default {
  key: "sendfox_oauth-add-new-contact-to-list",
  name: "Add new contact into a specific list",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendfox_oauth: {
      type: "app",
      app: "sendfox_oauth",
    },
    email: {
      type: "string",
    },
    first_name: {
      type: "string",
    },
    last_name: {
      type: "string",
    },
    lists: {
      type: "string",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.sendfox.com/contacts",
      method: "post",
      headers: {
        Authorization: `Bearer ${this.sendfox_oauth.$auth.oauth_access_token}`,
      },
      data: {
        email: this.email,
        first_name: this.first_name,
        last_name: this.last_name,
        lists: this.lists,
      },
    });
  },
};
