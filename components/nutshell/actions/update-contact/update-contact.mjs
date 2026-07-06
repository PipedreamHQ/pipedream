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
    name: {
      type: "string",
      label: "Name",
      description: "The contact's updated full name, e.g. `Jane Doe`.",
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
  },
  async run({ $ }) {
    const patches = [];

    if (this.name) {
      patches.push({
        op: PATCH_OPS.REPLACE,
        path: "/contacts/0/name",
        value: this.name,
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

    const displayName = updated?.name ?? this.name ?? this.contactId;

    $.export("$summary", `Successfully updated contact "${displayName}"`);
    return this.nutshell.formatContact(updated);
  },
};
