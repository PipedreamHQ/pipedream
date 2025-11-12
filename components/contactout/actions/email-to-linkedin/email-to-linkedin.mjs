import app from "../../contactout.app.mjs";

export default {
  key: "contactout-email-to-linkedin",
  name: "Email To LinkedIn",
  description: "Find LinkedIn profile from email address. [See the documentation](https://api.contactout.com/#email-to-linkedin-api).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "The email address to find LinkedIn profile for",
    },
  },
  async run({ $ }) {
    const {
      app,
      email,
    } = this;

    const response = await app.emailToLinkedIn({
      $,
      params: {
        email,
      },
    });

    $.export("$summary", "Successfully found LinkedIn profile for email");
    return response;
  },
};
