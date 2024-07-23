import app from "../../noor.app.mjs";

export default {
  key: "noor-send-text-message",
  name: "Send Text Message",
  description: "Send a message in a thread. [See the documentation](https://usenoor.notion.site/v0-e812ae5e5976420f81232fa1c0316e84)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
      ],
    },
    thread: {
      propDefinition: [
        app,
        "thread",
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendMessage({
      $,
      data: {
        spaceId: this.spaceId,
        thread: this.thread,
        text: this.text,
      },
    });

    if (response.error) throw new Error(response?.error);

    $.export("$summary", `Successfully sent message to '${this.thread}' thread`);

    return response;
  },
};
