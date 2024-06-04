import botpenguin from "../../botpenguin.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "botpenguin-add-contact",
  name: "Add Contact",
  description: "Adds a new contact to your BotPenguin account. Requires 'name' and 'email' props. 'name' is the full name of the contact and 'email' is their email address. Optionally, 'phone' prop can be added for phone number. [See the documentation](https://help.botpenguin.com/api-references/contacts-and-chats-apis/add-whatsapp-contact)",
  version: "0.0.1",
  type: "action",
  props: {
    botpenguin,
    name: botpenguin.propDefinitions.name,
    email: botpenguin.propDefinitions.email,
    phone: {
      ...botpenguin.propDefinitions.phone,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.botpenguin.addContact({
      name: this.name,
      email: this.email,
      phone: this.phone,
    });
    $.export("$summary", `Successfully added contact ${this.name}`);
    return response;
  },
};
