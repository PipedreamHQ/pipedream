import { ConfigurationError } from "@pipedream/platform";
import app from "../../fullenrich.app.mjs";

export default {
  key: "fullenrich-enrich-contact",
  name: "Enrich Contact",
  description: "Starts the enrichment process for a specified contact. [See the documentation](https://docs.fullenrich.com/startbulk)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the action.",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "The Webhook URL that will be triggered when the enrichment is done.",
      optional: true,
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact to enrich.",
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact to enrich.",
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the contact's company (e.g., example.com). Optional if **Company Name** is provided.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the contact's company. Optional if a **Domain** is provided.",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn URL of the contact to increase the probability of finding emails and phones.",
      optional: true,
    },
    enrichFields: {
      type: "string[]",
      label: "Enrich Fields",
      description: "The fields to enrich. By default, the action enriches contact emails and phones.",
      optional: true,
      options: [
        "contact.emails",
        "contact.phones",
      ],
    },
  },
  methods: {
    enrichContacts(args = {}) {
      return this.app.post({
        path: "/contact/enrich/bulk",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      enrichContacts,
      name,
      webhookUrl,
      firstname,
      lastname,
      domain,
      companyName,
      linkedinUrl,
      enrichFields,
    } = this;

    if (!domain && !companyName) {
      throw new ConfigurationError("You must provide either a **Domain** or a **Company Name**.");
    }

    const response = await enrichContacts({
      $,
      data: {
        name,
        webhook_url: webhookUrl,
        datas: [
          {
            firstname,
            lastname,
            domain,
            company_name: companyName,
            linkedin_url: linkedinUrl,
            enrich_fields: enrichFields,
          },
        ],
      },
    });

    $.export("$summary", `Successfully started the enrichment process with ID \`${response.enrichment_id}\`.`);
    return response;
  },
};
