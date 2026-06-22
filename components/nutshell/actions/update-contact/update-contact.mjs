import { parseObject } from "../../common/utils.mjs";
import { PATCH_OPS } from "../../common/constants.mjs";
import { ConfigurationError } from "@pipedream/platform";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-update-contact",
  name: "Update Contact",
  description: "Update an existing contact (person) in Nutshell. [See the documentation](https://developers.nutshell.com/reference/cb995ae09d7e0e99e91b122bcc9358ed)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nutshell,
    contactId: {
      propDefinition: [
        nutshell,
        "contactId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Updated first name. **Note:** the name patch replaces the entire name object, so if you provide only First Name the existing Last Name will be cleared. Provide both First Name and Last Name together to preserve the full name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Updated last name. **Note:** the name patch replaces the entire name object, so if you provide only Last Name the existing First Name will be cleared. Provide both First Name and Last Name together to preserve the full name.",
      optional: true,
    },
    email: {
      type: "string[]",
      label: "Email",
      description: "Array of email objects as JSON strings, e.g. `{\"isPrimary\":true,\"name\":\"work\",\"value\":\"jane@acme.com\"}`. Each object must include a `name` label (required on update).",
      optional: true,
    },
    phone: {
      type: "string[]",
      label: "Phone",
      description: "Array of phone objects as JSON strings, e.g. `{\"isPrimary\":true,\"name\":\"mobile\",\"value\":\"+15125551234\"}`. Each object must include a `name` label (required on update).",
      optional: true,
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "Updated job title.",
      optional: true,
    },
  },
  async run({ $ }) {
    const patches = [];

    // Build name patch only if at least one name field is provided
    if (this.firstName || this.lastName) {
      const nameValue = {
        ...(this.firstName
          ? {
            givenName: this.firstName,
          }
          : {}),
        ...(this.lastName
          ? {
            familyName: this.lastName,
          }
          : {}),
      };
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/contacts/0/name",
        value: nameValue,
      });
    }
    if (this.jobTitle) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/contacts/0/title",
        value: this.jobTitle,
      });
    }
    if (this.email) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/contacts/0/emails",
        value: parseObject(this.email),
      });
    }
    if (this.phone) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/contacts/0/phones",
        value: parseObject(this.phone),
      });
    }

    if (!patches?.length) {
      throw new ConfigurationError("Please provide at least one field to update.");
    }

    const updated = await this.nutshell.updateContact({
      $,
      contactId: this.contactId,
      patches,
    });

    const displayName = typeof updated?.name === "object"
      ? (updated.name?.displayName
        || [
          updated.name?.givenName,
          updated.name?.familyName,
        ].filter(Boolean).join(" ")
        || this.contactId)
      : (updated?.name ?? this.contactId);

    $.export("$summary", `Successfully updated contact "${displayName}"`);
    return this.nutshell.formatContact(updated);
  },
};
