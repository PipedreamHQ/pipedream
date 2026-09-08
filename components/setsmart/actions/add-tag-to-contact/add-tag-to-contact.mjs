import { ConfigurationError } from "@pipedream/platform";
import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-add-tag-to-contact",
  name: "Add Tag To Contact",
  description: "Add a tag to an existing contact. [See the documentation](https://setsmart.io/api-documentation)",
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

    const response = await this.setsmart.addTag({
      $,
      data: {
        conversation_id: this.contactId,
        phone: this.phone,
        email: this.email,
        tag: this.tag,
      },
    });

    $.export("$summary", `Successfully added the tag ${this.tag}`);
    return response;
  },
};
