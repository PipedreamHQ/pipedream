import app from "../../_46elks.app.mjs";

export default {
  key: "_46elks-send-sms",
  name: "Send SMS",
  description: "Composes and sends an SMS message to a specified phone number. [See the documentation](https://46elks.com/docs/send-sms)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    from: {
      label: "From Phone Number",
      description: "The phone number initiating sending the SMS message. A valid phone number in [E.164 format](https://46elks.com/kb/e164). Can be one of your voice enabled 46elks numbers, the phone number you signed up with, or an unlocked number.",
      propDefinition: [
        app,
        "number",
      ],
    },
    to: {
      label: "To Phone Number",
      description: "The phone number receiving the SMS message. The phone number of the recipient, in [E.164 format](https://46elks.com/kb/e164).",
      propDefinition: [
        app,
        "number",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
    whendelivered: {
      propDefinition: [
        app,
        "webhookUrl",
      ],
      optional: true,
    },
    flashSms: {
      type: "boolean",
      label: "Flash SMS",
      description: "Send the message as a Flash SMS. The message will be displayed immediately upon arrival and not stored.",
      optional: true,
    },
    dontLog: {
      type: "boolean",
      label: "Don't Log",
      description: "Enable to avoid storing the message text in your history. The other parameters will still be stored.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      flashSms,
      dontLog,
      ...data
    } = this;

    const response = await app.sendSms({
      $,
      data: {
        ...data,
        ...(flashSms === true && {
          flashsms: "yes",
        }),
        ...(dontLog === true && {
          dontlog: "message",
        }),
      },
    });

    $.export("$summary", `Successfully sent SMS with ID \`${response.id}\``);
    return response;
  },
};
