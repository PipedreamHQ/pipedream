import app from "../../textline.app.mjs";

export default {
  key: "textline-send-message",
  name: "Send Message",
  description: "Send a new message directly to a contact. [See the documentation](https://textline.docs.apiary.io/#reference/conversations/group-conversations/message-a-phone-number).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    comment: {
      type: "string",
      label: "Message",
      description: "The content of the message to send.",
    },
  },
  methods: {
    sendMessage(args = {}) {
      return this.app.post({
        path: "/conversations",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendMessage,
      phoneNumber,
      comment,
    } = this;
    const response = await sendMessage({
      $,
      data: {
        phone_number: phoneNumber,
        comment: {
          body: comment,
        },
        resolve: "1",
      },
    });

    $.export("$summary", `Successfully sent message to ${phoneNumber}.`);
    return response;
  },
};
