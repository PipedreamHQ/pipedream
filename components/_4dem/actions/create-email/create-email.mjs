import app from "../../_4dem.app.mjs";

export default {
  key: "_4dem-create-email",
  name: "Create Email",
  description: "Create a new email. [See the documentation](https://api.4dem.it/#/operations/contents.email.store)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "Email Name",
    },
    subject: {
      propDefinition: [
        app,
        "subject",
      ],
    },
    senderId: {
      propDefinition: [
        app,
        "senderId",
      ],
    },
    plain: {
      propDefinition: [
        app,
        "plain",
      ],
    },
    html: {
      propDefinition: [
        app,
        "html",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createEmail({
      $,
      data: {
        name: this.name,
        subject: this.subject,
        sender: {
          id: this.senderId,
        },
        content: {
          plain: this.plain,
          html: this.html,
        },
      },
    });

    $.export("$summary", `Successfully created email '${this.name}'`);

    return response;
  },
};
