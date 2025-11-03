// legacy_hash_id: a_WYiebr
import { axios } from "@pipedream/platform";

export default {
  key: "sendfox_personal_access_token-create-contact",
  name: "Create contact",
  description: "Creates new contact",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sendfox_personal_access_token: {
      type: "app",
      app: "sendfox_personal_access_token",
    },
    email: {
      type: "string",
    },
    first_name: {
      type: "string",
      optional: true,
    },
    last_name: {
      type: "string",
      optional: true,
    },
    lists: {
      type: "any",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: "https://api.sendfox.com/contacts",
      method: "post",
      headers: {
        Authorization: `Bearer ${this.sendfox_personal_access_token.$auth.access_token}`,
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
