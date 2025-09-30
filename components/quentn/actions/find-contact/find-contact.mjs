import app from "../../quentn.app.mjs";

export default {
  key: "quentn-find-contact",
  name: "Find Contact",
  description: "Finds a contact by email address. [See the docs](https://help.quentn.com/hc/en-150/articles/4517835330961-Contact-API).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $: step }) {
    const { email } = this;

    const [
      contact,
    ] = await this.app.listContactsByEmail({
      step,
      email: encodeURIComponent(email),
    });

    step.export("$summary", `Successfully found contact with ID ${contact.id}`);

    return contact;
  },
};
