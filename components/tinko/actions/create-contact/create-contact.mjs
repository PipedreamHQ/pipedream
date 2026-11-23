import app from "../../tinko.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "tinko-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Tinko."
    + " Use **Find Contact** first to avoid duplicates, **List Tags** to find tag IDs"
    + " and **List Custom Fields** to find the names of the custom fields."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/contacts/#criar-contato)",
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
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact, with country code, e.g. `5511999999999`.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact, e.g. `Nathan Smith`.",
      optional: true,
    },
    blocked: {
      type: "boolean",
      label: "Blocked",
      description: "Whether the contact is blocked, e.g. `false`. Tinko ignores messages from blocked contacts.",
      optional: true,
    },
    tagIds: {
      propDefinition: [
        app,
        "tagIds",
      ],
      description: "Tags to add to the contact, e.g. `[\"01JABCDEFGHJKMNPQRSTVWXYZ0\"]`. Use **List Tags** to find tag IDs (the `id` field).",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom field values keyed by field name, e.g. `{\"Email\": \"jane@example.com\", \"Birthday\": \"1990-05-17\"}`. Dates use the format `YYYY-MM-DD` and select fields accept one of their configured options. Use **List Custom Fields** to find the field names (the `name` field).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createContact({
      $,
      data: {
        phone: this.phone,
        name: this.name,
        blocked: this.blocked,
        tags: this.tagIds,
        customfields: parseJson(this.customFields, "Custom Fields"),
      },
    });

    const contact = response.data ?? {};
    $.export("$summary", `Successfully created contact ${contact.name || contact.phone || this.phone}`);
    return contact;
  },
};
