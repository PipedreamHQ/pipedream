import devin from "../../devin.app.mjs";

export default {
  key: "devin-send-message-to-session",
  name: "Send Message to Session",
  description: "Send a message to an existing Devin session. [See the documentation](https://docs.devin.ai/api-reference/sessions/send-a-message-to-an-existing-devin-session)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    devin,
    sessionId: {
      propDefinition: [
        devin,
        "sessionId",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to Devin",
    },
  },
  async run({ $ }) {
    const response = await this.devin.sendMessageToSession({
      $,
      sessionId: this.sessionId,
      data: {
        message: this.message,
      },
    });

    $.export("$summary", `Successfully sent message to session ${this.sessionId}`);
    return response;
  },
};
