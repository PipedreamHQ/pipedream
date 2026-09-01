import { ConfigurationError } from "@pipedream/platform";
import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-remove-tag-from-contact",
  name: "Remove Tag From Contact",
  description: "Remove a tag from an existing contact. [See the documentation](https://setsmart.io/api-documentation)",
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
    tag: {
      propDefinition: [
        setsmart,
        "tag",
      ],
    },
  },
  async run({ $ }) {
    if (!this.contactId && !this.phone && !this.email) {
      throw new ConfigurationError("You must provide at least one of **Contact ID**, **Phone** or **Email** to identify the contact.");
    }

    const response = await this.setsmart.removeTag({
      $,
      data: {
        conversation_id: this.contactId,
        phone: this.phone,
        email: this.email,
        tag: this.tag,
      },
    });

    $.export("$summary", `Successfully removed the tag ${this.tag}`);
    return response;
  },
};
