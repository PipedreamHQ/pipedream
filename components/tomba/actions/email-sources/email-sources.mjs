import app from "../../tomba.app.mjs";

export default {
  key: "tomba-email-sources",
  name: "Get Email Sources",
  description:
    "Find email address source somewhere on the web. [See the documentation](https://tomba.io/api)",
  version: "0.0.1",
  type: "action",
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
  async run({ $ }) {
    const response = await this.app.getEmailSources({
      $,
      email: this.email,
    });

    $.export("$summary", `Successfully found sources for email: ${this.email}`);
    return response;
  },
};
