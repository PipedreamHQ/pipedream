import flexmail from "../../flexmail.app.mjs";

export default {
  key: "flexmail-unsubscribe-contact",
  name: "Unsubscribe Contact",
  description: "Performs unsubscribe operation for a contact. This ensures that the selected contact will not receive future communications until they opt-in again.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flexmail,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact to unsubscribe",
      required: true,
    },
  },
  async run({ $ }) {
    const response = await this.flexmail.unsubscribeContact({
      contactId: this.email,
    });
    $.export("$summary", `Successfully unsubscribed contact with email ${this.email}`);
    return response;
  },
};
