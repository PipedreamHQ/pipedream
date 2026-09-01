import { ConfigurationError } from "@pipedream/platform";
import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-add-notes-to-contact",
  name: "Add Notes To Contact",
  description: "Append a note to a contact so your team sees the context in the inbox. [See the documentation](https://setsmart.io/api-documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    setsmart,
    contactId: {
      propDefinition: [
        setsmart,
        "contactId",
      ],
    },
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
    notes: {
      propDefinition: [
        setsmart,
        "notes",
      ],
    },
  },
  async run({ $ }) {
    if (!this.contactId && !this.phone && !this.email) {
      throw new ConfigurationError("You must provide at least one of **Contact ID**, **Phone** or **Email** to identify the contact.");
    }

    const response = await this.setsmart.addNotes({
      $,
      data: {
        contact_id: this.contactId,
        phone: this.phone,
        email: this.email,
        notes: this.notes,
      },
    });

    $.export("$summary", "Successfully added the note to the contact");
    return response;
  },
};
