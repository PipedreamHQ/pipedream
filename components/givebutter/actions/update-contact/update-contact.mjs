import { ConfigurationError } from "@pipedream/platform";
import givebutter from "../../givebutter.app.mjs";

export default {
  key: "givebutter-update-contact",
  name: "Update Contact",
  description: "Update an existing Givebutter contact, returning the updated contact object. Set only the fields you want to change. Use **List Contacts** first to find the contact ID. Note that Givebutter validates this as a full update — individual contacts require `first_name` and `last_name`, and company contacts require `company_name`, even when those values are not changing — so this action reads the contact first and re-sends its existing name and company values automatically. [See the documentation](https://docs.givebutter.com/api-reference/contacts/update-a-contact)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    givebutter,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to update (an integer identifier, e.g. `12345`). Run **List Contacts** to find valid contact IDs.",
    },
    firstName: {
      propDefinition: [
        givebutter,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        givebutter,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        givebutter,
        "email",
      ],
      description: "Email address to set on the contact, submitted in the API `emails` array. Example: `jane.updated@example.com`. Becomes the contact's primary email unless `Email Is Primary` is set to `false`.",
    },
    emailIsPrimary: {
      type: "boolean",
      label: "Email Is Primary",
      description: "Whether `Email` becomes the contact's primary email address (the API `is_primary` flag). Defaults to `true`; set to `false` to add it as a secondary address, leaving the existing primary in place. Ignored when `Email` is not set.",
      default: true,
      optional: true,
    },
    phone: {
      propDefinition: [
        givebutter,
        "phone",
      ],
      description: "Phone number to set on the contact, submitted in the API `phones` array. Example: `+15555550100`. Becomes the contact's primary phone unless `Phone Is Primary` is set to `false`.",
    },
    phoneIsPrimary: {
      type: "boolean",
      label: "Phone Is Primary",
      description: "Whether `Phone` becomes the contact's primary phone number (the API `is_primary` flag). Defaults to `true`; set to `false` to add it as a secondary number, leaving the existing primary in place. Ignored when `Phone` is not set.",
      default: true,
      optional: true,
    },
    companyName: {
      propDefinition: [
        givebutter,
        "companyName",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "Optional note to set on the contact.",
      optional: true,
    },
    tags: {
      propDefinition: [
        givebutter,
        "tags",
      ],
      description: "Optional list of tag strings to set on the contact (max 64 tags), replacing the contact's existing tags. Example: `[\"vip\", \"newsletter\"]`.",
    },
  },
  async run({ $ }) {
    if (this.email?.trim() === "" || this.phone?.trim() === "") {
      throw new ConfigurationError("Email and Phone cannot be blank. Omit the prop entirely to leave the contact's existing value unchanged.");
    }

    const updates = [
      this.firstName,
      this.lastName,
      this.email,
      this.phone,
      this.companyName,
      this.note,
      this.tags,
    ];
    if (updates.every((value) => value === undefined || value === null)) {
      throw new ConfigurationError("Set at least one field to update.");
    }

    const existing = await this.givebutter.getContact({
      $,
      contactId: this.contactId,
    });
    const current = existing?.data ?? existing;

    const contact = await this.givebutter.updateContact({
      $,
      contactId: this.contactId,
      data: {
        first_name: this.firstName ?? current?.first_name,
        last_name: this.lastName ?? current?.last_name,
        company_name: this.companyName ?? current?.company_name,
        ...(this.email && {
          emails: [
            {
              value: this.email,
              is_primary: this.emailIsPrimary ?? true,
            },
          ],
        }),
        ...(this.phone && {
          phones: [
            {
              value: this.phone,
              is_primary: this.phoneIsPrimary ?? true,
            },
          ],
        }),
        note: this.note,
        tags: this.tags,
      },
    });
    $.export("$summary", `Updated contact ${contact?.id ?? this.contactId}`);
    return contact;
  },
};
