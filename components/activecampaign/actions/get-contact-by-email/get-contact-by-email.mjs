// legacy_hash_id: a_m8ijkX
import axiosModule from "axios";

export default {
  key: "activecampaign-get-contact-by-email",
  name: "Activecampaign - Get contact by email",
  description: "Retrieves contact data from the ActiveCampaign CRM by email address",
  version: "0.2.2",
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

    //
    // Contributed to the pipedream community by https://taskforce.services
    //
    // Activecampaign - Provide incredible customer experiences by utilizing email marketing, marketing automation and other CRM tools
    // http://tfs.link/activecampaign
    //

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
