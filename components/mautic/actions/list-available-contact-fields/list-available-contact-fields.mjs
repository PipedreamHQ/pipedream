// legacy_hash_id: a_zNiVV6
import { axios } from "@pipedream/platform";

export default {
  key: "mautic-list-available-contact-fields",
  name: "List Available Contact Fields",
  description: "Gets a list of available contact fields including custom ones.",
  version: "0.1.1",
  type: "action",
  props: {
    mautic: {
      type: "app",
      app: "mautic",
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.mautic.org/#list-available-fields

    return await axios($, {
      method: "get",
      url: `${this.mautic.$auth.mautic_url}/api/contacts/list/fields`,
      headers: {
        Authorization: `Bearer ${this.mautic.$auth.oauth_access_token}`,
      },
    });
  },
};
