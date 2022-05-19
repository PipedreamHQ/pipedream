import app from "../../clearbit.app.mjs";

export default {
  key: "clearbit-email-lookup",
  name: "Email lookup",
  description: "This endpoint retrieves a person by email address. [See the docs here](https://dashboard.clearbit.com/docs#enrichment-api-person-api-email-lookup)",
  version: "0.3.1",
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    webhookUrl: {
      propDefinition: [
        app,
        "webhookUrl",
      ],
    },
    givenName: {
      label: "Given Name",
      type: "string",
      description: "First name of person.",
      optional: true,
    },
    familyName: {
      label: "Family Name",
      type: "string",
      description: "Last name of person. If you have this, passing this is strongly recommended to improve match rates.",
      optional: true,
    },
    ipAddress: {
      label: "IP Address",
      type: "string",
      description: "IP address of the person. If you have this, passing this is strongly recommended to improve match rates.",
      optional: true,
    },
    location: {
      label: "Location",
      type: "string",
      description: "The city or country where the person resides.",
      optional: true,
    },
    company: {
      label: "Company",
      type: "string",
      description: "The name of the person's employer.",
      optional: true,
    },
    company_domain: {
      label: "Company Domain",
      type: "string",
      description: "The domain for the person's employer.",
      optional: true,
    },
    linkedin: {
      propDefinition: [
        app,
        "linkedin",
      ],
      description: "The LinkedIn URL for the person.",
    },
    twitter: {
      propDefinition: [
        app,
        "twitter",
      ],
      description: "The Twitter handle for the person.",
    },
    facebook: {
      propDefinition: [
        app,
        "facebook",
      ],
      description: "The Facebook URL for the person.",
    },
  },
  async run({ $ }) {
    /*return await axios($, {
      url: `https://person.clearbit.com/v2/people/find?email=${this.email}&webhook_url=${this.webhook_url}&given_name=${this.given_name}&family_name=${this.family_name}&ip_address=${this.ip_address}&location=${this.location}&company=${this.company}&company_domain=${this.company_domain}&linkedin=${this.linkedin}&twitter=${this.twitter}&facebook=${this.facebook}`,
      headers: {
        Authorization: `Bearer ${this.clearbit.$auth.api_key}`,
      },
    });
    */
    return $;
  },
};
