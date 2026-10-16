import { ConfigurationError } from "@pipedream/platform";
import cavyro from "../../cavyro.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "cavyro-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Cavyro, optionally linked to a company."
    + " Provide at least a first or last name. The email must be unique in the workspace, so use **Find Contact** first to avoid duplicates."
    + " Use **List Companies** to find a `companyId` and **List Custom Fields** for required custom fields."
    + " [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    cavyro,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name, e.g. `Ana`. Provide a first name, a last name, or both.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name, e.g. `Petrović`.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address, e.g. `ana@example.com`. Must be unique in the workspace.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number, e.g. `+381601234567`.",
      optional: true,
    },
    telegram: {
      type: "string",
      label: "Telegram Username",
      description: "The contact's Telegram username without the `@`, e.g. `anapetrovic`.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Job Title",
      description: "The contact's job title, e.g. `Head of Sales`.",
      optional: true,
    },
    linkedin: {
      type: "string",
      label: "LinkedIn",
      description: "The contact's LinkedIn profile URL, e.g. `https://www.linkedin.com/in/anapetrovic`.",
      optional: true,
    },
    description: {
      propDefinition: [
        cavyro,
        "description",
      ],
    },
    companyId: {
      propDefinition: [
        cavyro,
        "companyId",
      ],
    },
    customFields: {
      propDefinition: [
        cavyro,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    if (!this.firstName && !this.lastName) {
      throw new ConfigurationError("Provide a first name or a last name.");
    }
    const contact = await this.cavyro.createContact({
      $,
      data: {
        contact: {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          phone: this.phone,
          telegram: this.telegram,
          title: this.title,
          linkedin: this.linkedin,
          description: this.description,
          custom_fields: parseObject(this.customFields),
        },
      },
    });
    if (this.companyId) {
      try {
        await this.cavyro.linkContactToCompany({
          $,
          contactId: contact.id,
          data: {
            company_contact: {
              company_id: this.companyId,
            },
          },
        });
      } catch (error) {
        throw new Error(`Created contact ${contact.id}, but linking it to company ${this.companyId} failed. Link it manually instead of re-running this action, which would create a duplicate. Cause: ${error.message}`);
      }
    }
    $.export("$summary", `Created contact ${contact.id}: ${contact.full_name}`);
    return contact;
  },
};
