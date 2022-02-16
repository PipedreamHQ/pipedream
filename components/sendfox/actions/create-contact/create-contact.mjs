// legacy_hash_id: a_WYiebr
import { axios } from "@pipedream/platform";

export default {
  key: "sendfox-create-contact",
  name: "Create contact",
  description: "Creates new contact",
  version: "0.1.1",
  type: "action",
  props: {
    sendfox: {
      type: "app",
      app: "sendfox",
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
        Authorization: `Bearer ${this.sendfox.$auth.access_token}`,
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
