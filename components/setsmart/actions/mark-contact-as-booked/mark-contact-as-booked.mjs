import { ConfigurationError } from "@pipedream/platform";
import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-mark-contact-as-booked",
  name: "Mark Contact As Booked",
  description: "Mark a contact as booked once a call has been scheduled, which stops the AI from chasing them. [See the documentation](https://setsmart.io/api-documentation)",
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
    instagramUsername: {
      propDefinition: [
        setsmart,
        "instagramUsername",
      ],
    },
  },
  async run({ $ }) {
    if (!this.contactId && !this.phone && !this.email && !this.instagramUsername) {
      throw new ConfigurationError("You must provide at least one of **Contact ID**, **Phone**, **Email** or **Instagram Username**.");
    }

    const response = await this.setsmart.setBooked({
      $,
      data: {
        contact_id: this.contactId,
        phone: this.phone,
        email: this.email,
        instagram_username: this.instagramUsername,
      },
    });

    $.export("$summary", "Successfully marked the contact as booked");
    return response;
  },
};
