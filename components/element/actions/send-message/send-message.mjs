import element from "../../element.app.mjs";

export default {
  key: "element-send-message",
  name: "Send Message",
  description: "Send a text message to a room. The room must be one the connected account has already joined, and must be identified by room ID rather than alias — use **List Rooms** to find it. Returns the `event_id` of the sent message. [See the documentation](https://spec.matrix.org/latest/client-server-api/#put_matrixclientv3roomsroomidsendeventtypetxnid)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    element,
    roomId: {
      propDefinition: [
        element,
        "roomId",
      ],
    },
    body: {
      type: "string",
      label: "Message",
      description: "The text of the message to send, e.g. `Hello from Pipedream!`",
    },
    msgtype: {
      type: "string",
      label: "Message Type",
      description: "The type of message to send. Defaults to `m.text`. `m.notice` marks the message as coming from an automated client — clients display it distinctly and never auto-respond to it, which prevents bot-to-bot reply loops. `m.emote` sends it as an action, e.g. displayed as \"* Alice waves\".",
      optional: true,
      options: [
        "m.text",
        "m.notice",
        "m.emote",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.element.sendMessage({
      $,
      roomId: this.roomId,
      data: {
        msgtype: this.msgtype || "m.text",
        body: this.body,
      },
    });
    $.export("$summary", `Successfully sent message \`${response?.event_id}\` to room \`${this.roomId}\``);
    return response;
  },
};
