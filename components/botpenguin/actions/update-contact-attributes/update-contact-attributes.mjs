import botpenguin from "../../botpenguin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "botpenguin-update-contact-attributes",
  name: "Update Contact Attributes",
  description: "Updates custom attributes for a specific contact in your BotPenguin account. Requires 'contact_id' and 'attributes' props.",
  version: "0.0.1",
  type: "action",
  props: {
    botpenguin,
    contactId: {
      propDefinition: [
        botpenguin,
        "contactId",
      ],
    },
    attributes: {
      propDefinition: [
        botpenguin,
        "attributes",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.botpenguin.updateContactAttributes({
      contactId: this.contactId,
      attributes: this.attributes,
    });
    $.export("$summary", `Successfully updated attributes for contact ID ${this.contactId}`);
    return response;
  },
};
