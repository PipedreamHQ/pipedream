// legacy_hash_id: a_2wipeG
import axiosModule from "axios";

export default {
  key: "activecampaign-get-tags-for-contact",
  name: "Get Contact Tags",
  version: "0.2.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    contact_id: {
      type: "string",
    },
  },
  async run() {
    const axios = axiosModule.default;

    const config = {
      method: "get",
      url: `${this.activecampaign.$auth.base_url}/api/3/contacts/${this.contact_id}/contactTags`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
    };
    return await axios(config).then((res) => {
      return res.data || [];
    });
  },
};
