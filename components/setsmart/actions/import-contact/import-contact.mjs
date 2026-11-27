import { ConfigurationError } from "@pipedream/platform";
import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-import-contact",
  name: "Import Contact",
  description: "Create a contact in the workspace and optionally hand it over to an AI assistant. [See the documentation](https://setsmart.io/api-documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    setsmart,
    phone: {
      propDefinition: [
        setsmart,
        "phone",
      ],
    },
    email: {
      propDefinition: [
        setsmart,
        "email",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    tag: {
      propDefinition: [
        setsmart,
        "tag",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        setsmart,
        "notes",
      ],
      optional: true,
    },
    assistantId: {
      propDefinition: [
        setsmart,
        "assistantId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.phone && !this.email) {
      throw new ConfigurationError("You must provide at least a **Phone** or an **Email** to import a contact.");
    }

    const response = await this.setsmart.importContact({
      $,
      data: {
        number: this.phone,
        email: this.email,
        name: this.firstName,
        last: this.lastName,
        tag: this.tag,
        notes: this.notes,
        assistant_id: this.assistantId,
      },
    });

    $.export("$summary", `Successfully imported the contact ${this.phone || this.email}`);
    return response;
  },
};
