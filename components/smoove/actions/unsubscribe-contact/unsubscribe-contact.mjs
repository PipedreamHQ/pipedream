import app from "../../smoove.app.mjs";

export default {
  key: "smoove-unsubscribe-contact",
  name: "Unsubscribe",
  description: "Unsubscribes a contact. [See the docs](https://rest.smoove.io/#!/Contacts/Contacts_Unsubscribe).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    email: {
      label: "Email",
      description: "Email of the subscriber.",
      propDefinition: [
        app,
        "contactId",
        () => ({
          mapper: ({
            email, firstName, lastName,
          }) => ({
            label: `${firstName} ${lastName} (${email})`.trim(),
            value: email,
          }),
        }),
      ],
    },
    reason: {
      type: "string",
      label: "Reason",
      description: "Why do you want this contact to unsubscribe?",
      optional: true,
    },
  },
  methods: {
    unsubscribeContact({
      contactId, ...args
    } = {}) {
      return this.app.makeRequest({
        method: "post",
        path: `/Contacts/${contactId}/Unsubscribe`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      email,
      reason,
    } = this;

    const response = await this.unsubscribeContact({
      step,
      contactId: email,
      params: {
        by: "Email",
      },
      data: {
        reason,
      },
    });

    step.export("$summary", "Succesfully unsubscribed contact");

    return response;
  },
};
