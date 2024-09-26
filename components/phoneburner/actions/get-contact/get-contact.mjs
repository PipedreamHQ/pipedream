import app from "../../phoneburner.app.mjs";

export default {
  name: "Get Contact",
  version: "0.0.1",
  key: "phoneburner-get-contact",
  description: "Get a specific contact. [See the documentation](https://www.phoneburner.com/developer/route_list#contacts)",
  type: "action",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getContact({
      $,
      contactId: this.contactId,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved contact with ID ${this.contactId}`);
    }

    return response;
  },
};
