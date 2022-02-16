// legacy_hash_id: a_8Ki7wk
import { axios } from "@pipedream/platform";

export default {
  key: "clearbit-company-name-to-domain",
  name: "Company Name to Domain",
  description: "The Company Name to Domain action lets you convert the exact name of a company to a website domain, and a logo.",
  version: "0.1.1",
  type: "action",
  props: {
    clearbit: {
      type: "app",
      app: "clearbit",
    },
    company_name: {
      type: "string",
      description: "The name of the company.",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://company.clearbit.com/v1/domains/find?name=${this.company_name}`,
      headers: {
        Authorization: `Bearer ${this.clearbit.$auth.api_key}`,
      },

    });
  },
};
