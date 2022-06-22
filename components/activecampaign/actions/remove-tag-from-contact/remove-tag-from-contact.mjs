// legacy_hash_id: a_1Wi7JX
import querystring from "querystring";
import axiosModule from "axios";

export default {
  key: "activecampaign-remove-tag-from-contact",
  name: "ActiveCampaign - Remove Contact Tag",
  version: "0.4.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    email: {
      type: "string",
    },
    tags: {
      type: "string",
    },
  },
  async run() {
    const axios = axiosModule.default;

    const config = {
      method: "post",
      url: `${this.activecampaign.$auth.base_url}/admin/api.php?api_action=contact_tag_remove&api_key=${this.activecampaign.$auth.api_key}`, // todo: api path
      // todo: data
      data: querystring.stringify({
        email: this.email,
        tags: this.tags,
      }),
    };

    return await axios(config);
  },
};
