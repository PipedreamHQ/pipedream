import { ConfigurationError } from "@pipedream/platform";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-single-contact-search",
  name: "Search Single Contact",
  description: "Find one specific person and reveal their contact data in a single call. Identify the person by `Email`, `LinkedIn URL`, or `First Name` + `Last Name` together with `Company Name` or `Company Domain`. Use `Reveal Emails` / `Reveal Phones` to choose what to unlock; each revealed field is billed. Returns the matched contact, or a \"No contact found\" summary when Lusha has no match. [See the documentation](https://docs.lusha.com/api-reference/search-&-enrich/search-and-enrich-contacts)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    lusha,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the person. Use together with `Last Name` and a company name or domain.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the person. Use together with `First Name` and a company name or domain.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company the person works at, e.g. `Lusha`",
      optional: true,
    },
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The domain name of the company, e.g. `lusha.com`",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the person",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn profile URL of the person, e.g. `https://www.linkedin.com/in/username`",
      optional: true,
    },
    revealEmails: {
      type: "boolean",
      label: "Reveal Emails",
      description: "Whether to reveal email addresses in the response",
      optional: true,
    },
    revealPhones: {
      type: "boolean",
      label: "Reveal Phones",
      description: "Whether to reveal phone numbers in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasName = this.firstName && this.lastName && (this.companyName || this.companyDomain);
    if (!this.email && !this.linkedinUrl && !hasName) {
      throw new ConfigurationError("Provide an `Email`, a `LinkedIn URL`, or `First Name` and `Last Name` with a `Company Name` or `Company Domain`.");
    }

    const reveal = [];
    if (this.revealEmails) reveal.push("emails");
    if (this.revealPhones) reveal.push("phones");

    const { results = [] } = await this.lusha.searchAndEnrichContacts({
      $,
      data: {
        contacts: [
          {
            firstName: this.firstName,
            lastName: this.lastName,
            companyName: this.companyName,
            companyDomain: this.companyDomain,
            email: this.email,
            linkedinUrl: this.linkedinUrl,
          },
        ],
        reveal: reveal.length
          ? reveal
          : undefined,
      },
    });

    const [
      contact,
    ] = results;

    if (!contact || contact.error?.code === "NOT_FOUND") {
      $.export("$summary", "No contact found");
      return contact ?? {};
    }
    if (contact.error) {
      throw new Error(contact.error.message || contact.error.code);
    }

    $.export("$summary", `Successfully found a contact with ID: ${contact.id}`);
    return contact;
  },
};
