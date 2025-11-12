import app from "../../_4dem.app.mjs";

export default {
  key: "_4dem-confirm-email",
  name: "Confirm Email",
  description: "Confirm sender email address. [See the documentation](https://api.4dem.it/#/operations/senders.email.confirm)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    senderId: {
      propDefinition: [
        app,
        "senderId",
      ],
    },
    authCode: {
      propDefinition: [
        app,
        "authCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.confirmEmail({
      $,
      senderId: this.senderId,
      data: {
        auth_code: this.authCode,
      },
    });

    $.export("$summary", "Successfully confirmed the sender email");

    return response;
  },
};
