// legacy_hash_id: a_l0i8LA
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-find-deal",
  name: "Find Deal",
  description: "Finds an existing deal by title or email.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    filters_title: {
      type: "string",
      description: "Filter by deal's title.",
      optional: true,
    },
    filters_email: {
      type: "string",
      description: "Filter by deal's contact email.",
      optional: true,
    },
  },
  async run({ $ }) {
  // See the API docs: https://developers.activecampaign.com/reference#list-all-deals

    if (!this.filters_title && !this.filters_email) {
      throw new Error("Must provide filters_title or filters_email parameter.");
    }

    const config = {
      url: `${this.activecampaign.$auth.base_url}/api/3/deals`,
      headers: {
        "Api-Token": `${this.activecampaign.$auth.api_key}`,
      },
      params: {
        "filters[title]": this.filters_title,
        "filters[email]": this.filters_email,
      },
    };

    return await axios($, config);
  },
};
