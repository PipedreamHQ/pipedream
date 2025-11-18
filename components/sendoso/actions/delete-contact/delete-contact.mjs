import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-delete-contact",
  name: "Delete Contact",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a contact from Sendoso. [See the documentation](https://sendoso.docs.apiary.io/#reference/contact-management)",
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

    const response = await this.sendoso.deleteContact({
      $,
      contactId,
    });

    $.export("$summary", `Successfully deleted contact ID: ${contactId}`);
    return response;
  },
};

