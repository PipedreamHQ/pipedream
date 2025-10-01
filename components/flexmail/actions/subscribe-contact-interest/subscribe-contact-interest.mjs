import flexmail from "../../flexmail.app.mjs";

export default {
  key: "flexmail-subscribe-contact-interest",
  name: "Subscribe Contact to Interest",
  description: "Adds a contact to an interest area. [See the documentation](https://api.flexmail.eu/documentation/#post-/contacts/-id-/interest-subscriptions)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    interest: {
      propDefinition: [
        flexmail,
        "interest",
      ],
    },
  },
  async run({ $ }) {
    await this.flexmail.subscribeContactInterest({
      contactId: this.contactId,
      data: {
        interest_id: this.interest,
      },
    });

    $.export("$summary", `Subscribed contact ID ${this.contactId} to interest id ${this.interest}.`);
    // nothing to return
  },
};
