import { PubSub } from "@google-cloud/pubsub";
import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Pub/Sub - Publish Message",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "google_cloud-pubsub-publish-message",
  description: "Publish a message to a Pub/Sub topic. [See the documentation](https://cloud.google.com/nodejs/docs/reference/pubsub/latest/pubsub/topic#_google_cloud_pubsub_Topic_publishMessage_member_1_)",
  type: "action",
  props: {
    googleCloud,
    topicName: {
      label: "Topic name",
      description: "The name of the topic to publish to, e.g. `my-topic`. Run the **Pub/Sub - List Topics** action to find valid topic names.",
      type: "string",
    },
    data: {
      label: "Message Data",
      description: "The body of the message to publish. To send structured data, pass a JSON string.",
      type: "string",
    },
    attributes: {
      label: "Attributes",
      description: "Optional key-value attributes to attach to the message. All values must be strings, e.g. `{ \"origin\": \"orders-service\", \"priority\": \"high\" }`.",
      type: "object",
      optional: true,
    },
  },
  async run({ $ }) {
    const pubSubClient = new PubSub(this.googleCloud.sdkParams());
    const messageId = await pubSubClient
      .topic(this.topicName)
      .publishMessage({
        data: Buffer.from(this.data),
        ...(this.attributes && {
          attributes: this.attributes,
        }),
      });
    $.export("$summary", `Published message \`${messageId}\` to topic \`${this.topicName}\``);
    return {
      messageId,
    };
  },
};
