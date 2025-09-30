import app from "../../clicksend.app.mjs";

export default {
  key: "clicksend-send-sms",
  name: "Send SMS",
  description: "Sends a new SMS to one or several recipients. [See the documentation](https://developers.clicksend.com/docs/rest/v3/#send-sms-message-s)",
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
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    listId: {
      optional: true,
      propDefinition: [
        app,
        "listId",
      ],
    },
    body: {
      propDefinition: [
        app,
        "body",
      ],
    },
  },
  methods: {
    sendSms(args = {}) {
      return this.app.post({
        path: "/sms/send",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendSms,
      from,
      body,
      to,
      listId,
    } = this;

    const response = await sendSms({
      $,
      data: {
        messages: [
          {
            from,
            body,
            to,
            list_id: listId,
          },
        ],
      },
    });

    $.export("$summary", `Successfully sent SMS with ID \`${response.data.messages[0].message_id}\``);
    return response;
  },
};
