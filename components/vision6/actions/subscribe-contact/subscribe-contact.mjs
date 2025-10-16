import vision6 from "../../vision6.app.mjs";

export default {
  key: "vision6-subscribe-contact",
  name: "Subscribe Contact",
  description: "Subscribe an existing contact. [See the docs here](https://api.vision6.com/#update-contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vision6,
    list: {
      propDefinition: [
        vision6,
        "list",
      ],
    },
    contact: {
      propDefinition: [
        vision6,
        "contact",
        (c) => ({
          listId: c.list,
          params: {
            subscribed: false,
          },
        }),
      ],
    },
  },
  async run({ $ }) {
    const data = {
      contacts: [
        {
          id: this.contact,
          subscribed: {
            email: true,
            mobile: true,
          },
        },
      ],
    };
    await this.vision6.updateContact(this.list, {
      data,
      $,
    });
    $.export("$summary", `Successfully subscribed contact with ID ${this.contact}`);
    // nothing to return
  },
};
