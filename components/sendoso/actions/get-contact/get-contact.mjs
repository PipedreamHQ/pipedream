import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-get-contact",
  name: "Get Contact",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve details about a specific contact. [See the documentation](https://sendoso.docs.apiary.io/#reference/contact-management)",
  type: "action",
  props: {
    sendoso,
    contactId: {
      propDefinition: [
        sendoso,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const { contactId } = this;

    const response = await this.sendoso.getContact({
      $,
      contactId,
    });

    $.export("$summary", `Successfully retrieved contact ID: ${contactId}`);
    return response;
  },
};

