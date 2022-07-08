import quickbooks from "../../quickbooks.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "quickbooks-get-my-company",
  name: "Get My Company",
  description: "Gets info about a company.",
  version: "0.1.2",
  type: "action",
  props: {
    quickbooks,
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/companyinfo/${this.quickbooks.$auth.company_id}`,
      headers: {
        "Authorization": `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
        "accept": "application/json",
        "content-type": "application/json",
      },
    });
  },
};
