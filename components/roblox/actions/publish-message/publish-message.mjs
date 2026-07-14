import app from "../../roblox.app.mjs";

export default {
  key: "roblox-publish-message",
  name: "Publish Message",
  description: "Publish a message to all servers of a Roblox universe. [See the documentation](https://create.roblox.com/docs/cloud/reference/Universe#Cloud_PublishUniverseMessage)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    universeId: {
      propDefinition: [
        app,
        "universeId",
      ],
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "The topic to publish the message on.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to publish.",
    },
  },
  async run({ $ }) {
    const response = await this.app.publishUniverseMessage({
      $,
      universeId: this.universeId,
      data: {
        topic: this.topic,
        message: this.message,
      },
    });
    $.export("$summary", `Published message to topic "${this.topic}"`);
    return response;
  },
};
