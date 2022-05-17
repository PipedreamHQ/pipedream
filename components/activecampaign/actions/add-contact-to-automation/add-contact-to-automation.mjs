// legacy_hash_id: a_xqig4J
import { axios } from "@pipedream/platform";

export default {
  key: "activecampaign-add-contact-to-automation",
  name: "Add Contact to Automation",
  description: "Adds an existing contact to an existing automation.",
  version: "0.1.2",
  type: "action",
  props: {
    activecampaign: {
      type: "app",
      app: "activecampaign",
    },
    automation: {
      type: "string",
      description: "List segment ID (0 for no segment).",
      optional: true,
    },
    contact_id: {
      type: "string",
      optional: true,
    },
    contact_email: {
      type: "string",
      optional: true,
    },
    api_output: {
      type: "string",
      description: "Response format: `xml`, `json`, or `serialize` (default is `xml`)",
      optional: true,
      options: [
        "xml",
        "json",
        "serialize",
      ],
    },
  },
  async run({ $ }) {
  // See the API docs: https://www.activecampaign.com/api/example.php?call=automation_contact_add

    if (!this.automation || (!this.contact_id && !this.contact_email)) {
      throw new Error("Must provide automation, and one of contact_id or contact_email parameters.");
    }

    //Prepares query string parameters object of the request
    var queryParams = {
      api_action: "automation_contact_add",
      api_key: this.activecampaign.$auth.api_key,
      api_output: this.api_output,
    };

    //Prepares body parameters of the recrets. API endpoint not taking object, works as string.
    var data = `automation=${this.automation}&`;
    if (this.contact_id) {
      data += `contact_id=${this.contact_id}`;
    } else {
      data += `contact_email=${this.contact_email}`;
    }

    //Sends the request against Active Campaign API
    const config = {
      method: "post",
      url: `${this.activecampaign.$auth.base_url}/admin/api.php`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: queryParams,
      data,
    };

    return axios($, config);
  },
};
