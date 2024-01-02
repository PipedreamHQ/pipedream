import flexmail from "../../flexmail.app.mjs";

export default {
  key: "flexmail-subscribe-contact-interest",
  name: "Subscribe Contact to Interest",
  description: "Manages a user's subscription to an interest area. Requires contact's email and the name of the interest. Automatically updates the contact's associated interests.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flexmail,
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
      required: true,
    },
    interestName: {
      type: "string",
      label: "Interest Name",
      description: "The name of the interest",
      required: true,
    },
  },
  async run({ $ }) {
    const contact = await this.flexmail.createContact({
      data: {
        email: this.email,
      },
    });

    if (!contact) {
      throw new Error("Contact creation failed");
    }

    const response = await this.flexmail.manageSubscription({
      contactId: contact.id,
      data: {
        interest: this.interestName,
      },
    });

    if (!response) {
      throw new Error("Subscription failed");
    }

    $.export("$summary", `Subscribed contact ${this.email} to interest ${this.interestName}`);
    return response;
  },
};
