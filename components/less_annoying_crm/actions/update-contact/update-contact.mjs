import { ConfigurationError } from "@pipedream/platform";
import app from "../../less_annoying_crm.app.mjs";
import { buildContactDetails } from "../../common/utils.mjs";

export default {
  key: "less_annoying_crm-update-contact",
  name: "Update Contact",
  description: "Updates an existing contact or company in Less Annoying CRM. Only the fields you provide are changed; omitted fields are left as-is."
    + " Get the `contactId` from **Search Contacts** first."
    + " `name` renames the record (for a company it sets the company name; the action detects which). `employer` changes the company a person works for."
    + " Warning: `emails`, `phones`, `websites`, and the address fields REPLACE the existing values for that field rather than appending, so include existing entries you want to keep (read them with **Get Contact**)."
    + " Use `assignedTo` (user ID from **List Users**) to reassign ownership, and `customFields` for account-specific fields."
    + " Returns a confirmation; call **Get Contact** to see the updated record."
    + " Example: `contactId: \"1234567890123456789012345678901\", jobTitle: \"CEO\", phones: [\"555-123-4567\"]` returns `{\"success\": true, \"ContactId\": \"1234567890123456789012345678901\"}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Contacts#Goto-EditContact)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "New full name of the person, or new company name for a company, e.g. `Jane Smith` or `Acme Inc`.",
      optional: true,
    },
    employer: {
      propDefinition: [
        app,
        "employer",
      ],
    },
    assignedTo: {
      propDefinition: [
        app,
        "assignedTo",
      ],
      description: "User ID to reassign the record to (a numeric string, e.g. `1240220`). Use **List Users** to find IDs (the `UserId` field). Omit to keep the current owner.",
    },
    emails: {
      propDefinition: [
        app,
        "emails",
      ],
    },
    phones: {
      propDefinition: [
        app,
        "phones",
      ],
    },
    websites: {
      propDefinition: [
        app,
        "websites",
      ],
    },
    infoType: {
      propDefinition: [
        app,
        "infoType",
      ],
    },
    street: {
      propDefinition: [
        app,
        "street",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        app,
        "zip",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    jobTitle: {
      propDefinition: [
        app,
        "jobTitle",
      ],
    },
    backgroundInfo: {
      propDefinition: [
        app,
        "backgroundInfo",
      ],
    },
    birthday: {
      propDefinition: [
        app,
        "birthday",
      ],
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const parameters = {
      ...buildContactDetails(this),
      // Last, so `customFields` can't redirect the edit to a different contact.
      ContactId: this.contactId,
    };

    // A person's name and a company's name live in different fields, and
    // companies don't support Job Title or Birthday, so look up the record type.
    if (this.name || this.employer || this.jobTitle || this.birthday) {
      const existing = await this.app.getContact({
        $,
        parameters: {
          ContactId: this.contactId,
        },
      });
      if (existing.IsCompany) {
        if (this.name) parameters["Company Name"] = this.name;
        delete parameters["Job Title"];
        delete parameters.Birthday;
      } else {
        if (this.name) parameters.Name = this.name;
        if (this.employer) parameters["Company Name"] = this.employer;
      }
    }

    if (Object.keys(parameters).length === 1) {
      throw new ConfigurationError("Provide at least one field to update.");
    }

    await this.app.editContact({
      $,
      parameters,
    });

    $.export("$summary", `Updated contact ${this.contactId}`);
    return {
      success: true,
      ContactId: this.contactId,
    };
  },
};
