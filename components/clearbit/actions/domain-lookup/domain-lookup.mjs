// legacy_hash_id: a_xqiqma
import { axios } from "@pipedream/platform";

export default {
  key: "clearbit-domain-lookup",
  name: "Domain lookup",
  description: "The Company API allows you to look up a company by their domain",
  version: "0.1.1",
  type: "action",
  props: {
    clearbit: {
      type: "app",
      app: "clearbit",
    },
    domain: {
      type: "string",
      description: "The domain to look up.",
    },
    webhook_url: {
      type: "string",
      description: "A webhook URL that results will be sent to.",
      optional: true,
    },
    company_name: {
      type: "string",
      description: "The name of the company.",
      optional: true,
    },
    linkedin: {
      type: "string",
      description: "The LinkedIn URL for the company.",
      optional: true,
    },
    twitter: {
      type: "string",
      description: "The Twitter handle for the company.",
      optional: true,
    },
    facebook: {
      type: "string",
      description: "The Facebook URL for the company.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://company.clearbit.com/v2/companies/find?domain=${this.domain}&webhook_url=${this.webhook_url}&company_name=${this.company_name}&linkedin=${this.linkedin}&twitter=${this.twitter}&facebook=${this.facebook}`,
      headers: {
        Authorization: `Bearer ${this.clearbit.$auth.api_key}`,
      },
    });
  },
};
