// legacy_hash_id: a_oVi7Vk
import axiosModule from "axios";

export default {
  key: "activecampaign-get-ac-contact-by-email",
  name: "Get ActiveCampaign Contact by Email",
  version: "0.9.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    email: {
      type: "string",
    },
  },
  async run() {
    let axios = axiosModule.default;

    const config = {
      method: "get",
      url: `${this.activecampaign.$auth.base_url}/api/3/contacts?search=${this.email}`, // todo: api path
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
    };
    return await axios(config).then((res) => {
      return res.data.contacts || [];
    });
  },
};
