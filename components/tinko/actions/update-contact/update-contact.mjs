import { ConfigurationError } from "@pipedream/platform";
import app from "../../tinko.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "tinko-update-contact",
  name: "Update Contact",
  description: "Update the name, blocked status, tags or custom fields of a contact."
    + " The phone number cannot be changed."
    + " **Tags** and **Custom Fields** replace the values currently stored on the contact; use **Add Tag to Contact** to keep the existing tags."
    + " Use **Find Contact** to find the contact ID."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/contacts/#atualizar-contato)",
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
      description: "New name of the contact, e.g. `Nathan Smith`.",
      optional: true,
    },
    blocked: {
      type: "boolean",
      label: "Blocked",
      description: "Whether the contact is blocked, e.g. `true`. Tinko ignores messages from blocked contacts.",
      optional: true,
    },
    tagIds: {
      propDefinition: [
        app,
        "tagIds",
      ],
      description: "Tags of the contact, e.g. `[\"01JABCDEFGHJKMNPQRSTVWXYZ0\"]`. This replaces all tags currently on the contact. Use **List Tags** to find tag IDs (the `id` field).",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom field values keyed by field name, e.g. `{\"Email\": \"jane@example.com\"}`. This replaces all custom field values currently stored on the contact. Use **List Custom Fields** to find the field names (the `name` field).",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      blocked: this.blocked,
      tags: this.tagIds,
      customfields: parseJson(this.customFields, "Custom Fields"),
    };

    if (Object.values(data).every((value) => value === undefined)) {
      throw new ConfigurationError("Provide at least one field to update.");
    }

    const response = await this.app.updateContact({
      $,
      contactId: this.contactId,
      data,
    });

    const contact = response.data ?? {};
    $.export("$summary", `Successfully updated contact ${contact.name || contact.phone || this.contactId}`);
    return contact;
  },
};
