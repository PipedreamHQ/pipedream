import { ConfigurationError } from "@pipedream/platform";
import botpenguin from "../../botpenguin.app.mjs";

export default {
  key: "botpenguin-update-contact-attributes",
  name: "Update Contact Attributes",
  description: "Updates custom attributes for a specific contact in your BotPenguin account.",
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
    name: {
      propDefinition: [
        botpenguin,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        botpenguin,
        "email",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        botpenguin,
        "phone",
      ],
      optional: true,
    },
    prefix: {
      propDefinition: [
        botpenguin,
        "prefix",
      ],
      optional: true,
    },
    telegram: {
      type: "string",
      label: "Telegram",
      description: "The telegram username.",
      optional: true,
    },
    instagram: {
      type: "string",
      label: "Instagram",
      description: "The Instagram profile Id.",
      optional: true,
    },
    facebook: {
      type: "string",
      label: "Facebook",
      description: "The Facebook profile Id.",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    const contact = await this.botpenguin.getContact({
      contactId: this.contactId,
    });

    if (!contact.profile.userDetails.contact) contact.profile.userDetails.contact = {};
    if (this.name) contact.profile.userDetails.userProvidedName = this.name;
    if (this.email) contact.profile.userDetails.contact.email = this.email;
    if (this.phone || this.prefix) contact.profile.userDetails.contact.phone = {};
    if (this.phone) contact.profile.userDetails.contact.phone.number = this.phone;
    if (this.prefix) contact.profile.userDetails.contact.phone.prefix = this.prefix;
    if (this.telegram) contact.profile.userDetails.telegramUserName = this.telegram;
    if (this.instagram) contact.profile.userDetails.instagramProfileId = this.instagram;
    if (this.facebook) contact.profile.userDetails.facebookProfileId = this.facebook;
    if (this.phone && this.prefix) contact.profile.userDetails.whatsAppNumber = `${this.prefix} ${this.phone}`;

    try {
      response = await this.botpenguin.updateContact({
        $,
        contactId: this.contactId,
        data: contact,
      });
    } catch (e) {
      const message = JSON.parse(e.message);
      throw new ConfigurationError(message.data.join(" "));
    }

    $.export("$summary", `Successfully updated attributes for contact ID ${this.contactId}`);
    return response;
  },
};
