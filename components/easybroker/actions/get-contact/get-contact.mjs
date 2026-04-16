import easybroker from "../../easybroker.app.mjs";

export default {
  key: "easybroker-get-contact",
  name: "Get Contact",
  description: "Get details of a contact. [See the documentation](https://dev.easybroker.com/reference/get_contacts-contact-id)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    easybroker,
    contactId: {
      propDefinition: [
        easybroker,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.easybroker.getContact({
      $,
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully retrieved contact with ID ${this.contactId}`);
    return response;
  },
};
