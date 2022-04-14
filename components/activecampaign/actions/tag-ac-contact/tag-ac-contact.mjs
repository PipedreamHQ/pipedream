// legacy_hash_id: a_PNiBWG
import axiosModule from "axios";

export default {
  key: "activecampaign-tag-ac-contact",
  name: "Tag ActiveCampaign Contact",
  version: "0.2.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    contact_id: {
      type: "string",
      label: "Contact ID",
      description: "Activecampaign contact id",
    },
    tag_id: {
      type: "string",
      label: "Tag ID",
      description: "Activecampaign tag id",
    },
  },
  async run() {
    let axios = axiosModule.default;

    const config = {
      method: "post",
      url: `${this.activecampaign.$auth.base_url}/api/3/contactTags`, // todo: api path
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
      // todo: data
      data: {
        contactTag: {
          contact: this.contact_id,
          tag: this.tag_id,
        },
      },
    };
    return await axios(config);
  },
};
