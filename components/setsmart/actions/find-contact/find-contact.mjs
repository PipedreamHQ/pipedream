import { ConfigurationError } from "@pipedream/platform";
import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-find-contact",
  name: "Find Contact",
  description: "Find a contact and its conversation history by ID, phone number, email address, Instagram username or tag. [See the documentation](https://setsmart.io/api-documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    instagramUsername: {
      propDefinition: [
        setsmart,
        "instagramUsername",
      ],
    },
    tag: {
      propDefinition: [
        setsmart,
        "tag",
      ],
      description: "Return the contacts carrying this tag",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.contactId && !this.phone && !this.email && !this.instagramUsername && !this.tag) {
      throw new ConfigurationError("You must provide at least one of **Contact ID**, **Phone**, **Email**, **Instagram Username** or **Tag**.");
    }

    const response = await this.setsmart.findContact({
      $,
      params: {
        contact_id: this.contactId,
        phone: this.phone,
        email: this.email,
        instagram_username: this.instagramUsername,
        tag: this.tag,
      },
    });

    $.export("$summary", "Successfully searched for the contact");
    return response;
  },
};
