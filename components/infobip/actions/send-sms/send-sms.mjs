import infobip from "../../infobip.app.mjs";

export default {
  key: "infobip-send-sms",
  name: "Send SMS",
  description: "Sends an SMS message to a specified number. [See the documentation](https://www.infobip.com/docs/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    infobip,
    phoneNumber: {
      propDefinition: [
        infobip,
        "phoneNumber",
      ],
      optional: true,
    },
    text: {
      propDefinition: [
        infobip,
        "text",
      ],
      optional: true,
    },
    from: {
      propDefinition: [
        infobip,
        "from",
      ],
      optional: true,
    },
    flash: {
      type: "boolean",
      label: "FLash",
      description: "Allows for sending a flash SMS to automatically appear on recipient devices without interaction.",
      optional: true,
    },
    notifyUrl: {
      type: "string",
      label: "Notify URL",
      description: "The URL on your call back server on to which a delivery report will be sent. The [retry cycle](https://www.infobip.com/docs/sms/api#notify-url) for when your URL becomes unavailable uses the following formula: `1min + (1min * retryNumber * retryNumber)`.",
      optional: true,
    },
    entityId: {
      propDefinition: [
        infobip,
        "entityId",
      ],
      optional: true,
    },
    applicationId: {
      propDefinition: [
        infobip,
        "applicationId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      infobip,
      phoneNumber,
      ...data
    } = this;
    const response = await infobip.sendSms({
      $,
      data: {
        messages: [
          {
            destinations: [
              {
                to: phoneNumber,
              },
            ],
            data,
          },
        ],
      },
    });

    $.export("$summary", response.messages[0].status.description);
    return response;
  },
};
