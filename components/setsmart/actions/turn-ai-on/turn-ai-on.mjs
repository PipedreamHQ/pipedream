import { ConfigurationError } from "@pipedream/platform";
import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-turn-ai-on",
  name: "Turn AI On",
  description: "Let the AI assistant answer this contact again. [See the documentation](https://setsmart.io/api-documentation)",
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
  },
  async run({ $ }) {
    if (!this.contactId && !this.phone && !this.email) {
      throw new ConfigurationError("You must provide at least one of **Contact ID**, **Phone** or **Email** to identify the contact.");
    }

    const response = await this.setsmart.turnAiOn({
      $,
      data: {
        contact_id: this.contactId,
        phone: this.phone,
        email: this.email,
      },
    });

    $.export("$summary", "Successfully turned the AI on for the contact");
    return response;
  },
};
