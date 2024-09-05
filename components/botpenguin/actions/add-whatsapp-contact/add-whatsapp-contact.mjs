import { ConfigurationError } from "@pipedream/platform";
import botpenguin from "../../botpenguin.app.mjs";

export default {
  key: "botpenguin-add-whatsapp-contact",
  name: "Add WhatsApp Contact",
  description: "Adds a new WhatsApp contact to your BotPenguin account. [See the documentation](https://help.botpenguin.com/api-references/contacts-and-chats-apis/add-whatsapp-contact)",
  version: "0.0.1",
  type: "action",
  props: {
    botpenguin,
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
    },
    prefix: {
      propDefinition: [
        botpenguin,
        "prefix",
      ],
    },
  },
  async run({ $ }) {
    let response;

    try {
      response = await this.botpenguin.addContact({
        $,
        data: [
          {
            profile: {
              userDetails: {
                userProvidedName: this.name,
                contact: {
                  email: this.email,
                  phone: {
                    number: this.phone,
                    prefix: this.prefix,
                  },
                },
              },
            },
          },
        ],
      });
    } catch (e) {
      const message = JSON.parse(e.message);
      throw new ConfigurationError(message.data.join(" "));
    }

    $.export("$summary", "Successfully added contact!");
    return response;
  },
};
