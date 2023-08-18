/* eslint-disable no-unused-vars */
import message from "../../common/message.mjs";
import app from "../../superphone.app.mjs";

export default {
  key: "superphone-send-message",
  name: "Send Message",
  description: "Send a message to a contact. [See the documentation](https://api.superphone.io/docs/mutation.doc.html)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    conversationId: {
      propDefinition: [
        app,
        "conversationId",
      ],
    },
    mobile: {
      description: "Recipient mobile number.",
      propDefinition: [
        app,
        "mobile",
      ],
    },
    recipient: {
      label: "Recipient",
      description: "Messaging ID of recipient message should be sent to.",
      propDefinition: [
        app,
        "messageId",
        ({ conversationId }) => ({
          conversationId,
        }),
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "Content of the message.",
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "Desired platform to be sent with.",
      options: [
        "TWILIO",
        "FACEBOOK",
      ],
    },
  },
  methods: {
    sendMessage(variables = {}) {
      return this.app.makeRequest({
        query: message.mutations.sendMessage,
        variables,
      });
    },
  },
  async run({ $: step }) {
    const {
      app,
      sendMessage,
      ...input
    } = this;

    const {
      sendMessage: {
        message,
        sendMessageUserErrors,
      },
    } = await sendMessage({
      input,
    });

    if (sendMessageUserErrors?.length) {
      throw new Error(JSON.stringify(sendMessageUserErrors));
    }

    step.export("$summary", `Successfully sent message with ID ${message.id}`);

    return message;
  },
};
