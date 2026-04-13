import app from "../../apollo_io_oauth.app.mjs";

export default {
  key: "apollo_io_oauth-enrich-person",
  name: "Enrich Person",
  description:
    "Enriches a person's information using Apollo's 270M+"
    + " contact database. Pass any combination of name, email,"
    + " domain, organization, or LinkedIn URL — the more info"
    + " you provide, the better the match."
    + " This action consumes Apollo enrichment credits."
    + " Returns detailed profile data including title, company,"
    + " seniority, phone numbers, and social profiles."
    + " Do NOT pass personal social media URLs as the `domain`"
    + " — use only company domains like `apollo.io`."
    + " If `revealPhoneNumber` is `true`, you must also provide"
    + " a `webhookUrl` where Apollo will POST the phone data"
    + " asynchronously."
    + " [See the documentation](https://docs.apollo.io/reference"
    + "/people-enrichment)",
  version: "0.0.1",
  type: "action",
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
      description: "The person's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Full Name",
      description:
        "The person's full name. Use this instead of separate"
        + " first/last name fields if you only have the full"
        + " name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The person's email address.",
      optional: true,
    },
    hashedEmail: {
      type: "string",
      label: "Hashed Email",
      description:
        "MD5 or SHA-256 hashed email. Example:"
        + " `8d935115b9ff4489f2d1f9249503cadf` (MD5).",
      optional: true,
    },
    organizationName: {
      type: "string",
      label: "Organization Name",
      description: "The person's company name.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description:
        "The company domain (not a personal URL). Example:"
        + " `apollo.io` or `microsoft.com`. Do NOT include"
        + " `www.` or `@`.",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description:
        "The person's LinkedIn profile URL. Example:"
        + " `https://www.linkedin.com/in/johndoe`.",
      optional: true,
    },
    revealPersonalEmails: {
      type: "boolean",
      label: "Reveal Personal Emails",
      description:
        "Set to `true` to include personal email addresses in"
        + " the enrichment results.",
      optional: true,
    },
    revealPhoneNumber: {
      type: "boolean",
      label: "Reveal Phone Number",
      description:
        "Set to `true` to request phone numbers including"
        + " mobile. Requires `webhookUrl` to be set — Apollo"
        + " delivers phone data asynchronously via webhook.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description:
        "Required when `revealPhoneNumber` is `true`. Apollo"
        + " will POST a JSON payload with phone data to this"
        + " URL.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.peopleEnrichment({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        name: this.name,
        email: this.email,
        hashed_email: this.hashedEmail,
        organization_name: this.organizationName,
        domain: this.domain,
        linkedin_url: this.linkedinUrl,
        reveal_personal_emails: this.revealPersonalEmails,
        reveal_phone_number: this.revealPhoneNumber,
        webhook_url: this.webhookUrl,
      },
    });

    const person = response.person;

    $.export(
      "$summary",
      person
        ? `Enriched ${person.name || person.email || person.id}`
        : "No match found",
    );

    return response;
  },
};
