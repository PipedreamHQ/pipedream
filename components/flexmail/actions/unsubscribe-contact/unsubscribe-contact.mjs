import flexmail from "../../flexmail.app.mjs";

export default {
  key: "flexmail-unsubscribe-contact",
  name: "Unsubscribe Contact",
  description: "Performs unsubscribe operation for a contact. [See the documentation](https://api.flexmail.eu/documentation/#post-/contacts/-id-/unsubscribe)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    flexmail,
    contactId: {
      propDefinition: [
        flexmail,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.flexmail.unsubscribeContact({
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully unsubscribed contact with id ${this.contactId}.`);
    return response;
  },
};
