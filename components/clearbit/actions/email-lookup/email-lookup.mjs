// legacy_hash_id: a_vgi4Qv
import { axios } from "@pipedream/platform";

export default {
  key: "clearbit-email-lookup",
  name: "Email lookup",
  description: "This endpoint retrieves a person by email address",
  version: "0.3.1",
  type: "action",
  props: {
    clearbit: {
      type: "app",
      app: "clearbit",
    },
    email: {
      type: "string",
      description: "The email address to look up.",
    },
    webhook_url: {
      type: "string",
      description: "A webhook URL that results will be sent to.",
      optional: true,
    },
    given_name: {
      type: "string",
      description: "First name of person.",
      optional: true,
    },
    family_name: {
      type: "string",
      description: "Last name of person. If you have this, passing this is strongly recommended to improve match rates.",
      optional: true,
    },
    ip_address: {
      type: "string",
      description: "IP address of the person. If you have this, passing this is strongly recommended to improve match rates.",
      optional: true,
    },
    location: {
      type: "string",
      description: "The city or country where the person resides.",
      optional: true,
    },
    company: {
      type: "string",
      description: "The name of the person's employer.",
      optional: true,
    },
    company_domain: {
      type: "string",
      description: "The domain for the person's employer.",
      optional: true,
    },
    linkedin: {
      type: "string",
      description: "The LinkedIn URL for the person.",
      optional: true,
    },
    twitter: {
      type: "string",
      description: "The Twitter handle for the person.",
      optional: true,
    },
    facebook: {
      type: "string",
      description: "The Facebook URL for the person.",
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://person.clearbit.com/v2/people/find?email=${this.email}&webhook_url=${this.webhook_url}&given_name=${this.given_name}&family_name=${this.family_name}&ip_address=${this.ip_address}&location=${this.location}&company=${this.company}&company_domain=${this.company_domain}&linkedin=${this.linkedin}&twitter=${this.twitter}&facebook=${this.facebook}`,
      headers: {
        Authorization: `Bearer ${this.clearbit.$auth.api_key}`,
      },
    });
  },
};
