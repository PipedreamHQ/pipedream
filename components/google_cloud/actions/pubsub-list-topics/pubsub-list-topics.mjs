import { PubSub } from "@google-cloud/pubsub";
import googleCloud from "../../google_cloud.app.mjs";

export default {
  name: "Pub/Sub - List Topics",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "google_cloud-pubsub-list-topics",
  description: "List the Pub/Sub topics in your project. Use a returned topic name as the `Topic name` input of the **Pub/Sub - Publish Message** action. [See the documentation](https://cloud.google.com/nodejs/docs/reference/pubsub/latest/pubsub/pubsub#_google_cloud_pubsub_PubSub_getTopics_member_1_)",
  type: "action",
  props: {
    googleCloud,
  },
  async run({ $ }) {
    const pubSubClient = new PubSub(this.googleCloud.sdkParams());
    const [
      topics,
    ] = await pubSubClient.getTopics();
    const topicNames = topics.map((topic) => topic.name);
    $.export("$summary", `Found ${topicNames.length} topic${topicNames.length === 1
      ? ""
      : "s"}`);
    return topicNames;
  },
};
