import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-people-enrichment",
  name: "People Enrichment",
  description: "Enriches a person's information, the more information you pass in, the more likely we can find a match. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#people-enrichment)",
  type: "action",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The person's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the person",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The person's email",
      optional: true,
    },
    hashedEmail: {
      type: "string",
      label: "Hashed Email",
      description: "The hashed email of the person. The email should adhere to either the MD5 or SHA-256 hash format. Example: `8d935115b9ff4489f2d1f9249503cadf` (MD5) or `97817c0c49994eb500ad0a5e7e2d8aed51977b26424d508f66e4e8887746a152` (SHA-256)",
      optional: true,
    },
    organizationName: {
      type: "string",
      label: "Organization Name",
      description: "The person's company name",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain name for the person's employer. This can be the current employer or a previous employer. Do not include `www.`, the `@` symbol, or similar. Example: `apollo.io` or `microsoft.com`",
      optional: true,
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The Apollo ID for the person",
      optional: true,
      async options({ page }) {
        const { people } = await this.peopleSearch({
          params: {
            page: page + 1,
          },
        });
        return people?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The URL for the person's LinkedIn profile",
      optional: true,
    },
    revealPersonalEmails: {
      type: "boolean",
      label: "Reveal Personal Emails",
      description: "Set to `true` if you want to enrich the person's data with personal emails",
      optional: true,
    },
    revealPhoneNumber: {
      type: "boolean",
      label: "Reveal Phone Number",
      description: "Set to `true` if you want to enrich the person's data with all available phone numbers, including mobile phone numbers",
      optional: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.revealPhoneNumber) {
      props.webhookUrl = {
        type: "string",
        label: "Webhook URL",
        description: "Enter the webhook URL that specifies where Apollo should send a JSON response that includes the phone number you requested. Required if \"Reveal Phone Number\" is set to `true`",
      };
    }
    return props;
  },
  methods: {
    peopleSearch(args = {}) {
      return this.app.post({
        path: "/people/search",
        ...args,
      });
    },
    peopleEnrichment(args = {}) {
      return this.app.post({
        path: "/people/match",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      peopleEnrichment,
      firstName,
      lastName,
      name,
      email,
      hashedEmail,
      organizationName,
      domain,
      personId,
      linkedinUrl,
      revealPersonalEmails,
      revealPhoneNumber,
      webhookUrl,
    } = this;

    const response = await peopleEnrichment({
      step,
      data: {
        first_name: firstName,
        last_name: lastName,
        name,
        email,
        hashed_email: hashedEmail,
        organization_name: organizationName,
        domain,
        id: personId,
        linkedin_url: linkedinUrl,
        reveal_personal_emails: revealPersonalEmails,
        reveal_phone_number: revealPhoneNumber,
        webhook_url: webhookUrl,
      },
    });

    step.export("$summary", `Successfully enriched person with ID ${response.person.id}`);

    return response;
  },
};
