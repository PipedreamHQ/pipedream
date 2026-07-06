import { PubSub } from "@google-cloud/pubsub";
import googleCloud from "../../google_cloud.app.mjs";
import constants from "../../common/constants.mjs";

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
    maxResults: {
      label: "Max Results",
      description: "The maximum number of topics to return.",
      type: "integer",
      optional: true,
      default: 100,
      min: 1,
      max: 99999,
    },
  },
  async run({ $ }) {
    const pubSubClient = new PubSub(this.googleCloud.sdkParams());
    const pageSize = (remaining) => Math.min(remaining, constants.MAX_PAGE_SIZE);

    const topics = [];
    let query = {
      autoPaginate: false,
      pageSize: pageSize(this.maxResults),
    };

    do {
      const [
        pageTopics,
        nextQuery,
      ] = await pubSubClient.getTopics(query);
      topics.push(...pageTopics);
      query = nextQuery && {
        ...nextQuery,
        autoPaginate: false,
        pageSize: pageSize(this.maxResults - topics.length),
      };
    } while (query && topics.length < this.maxResults);

    const topicNames = topics.slice(0, this.maxResults).map((topic) => topic.name);
    $.export("$summary", `Found ${topicNames.length} topic${topicNames.length === 1
      ? ""
      : "s"}`);
    return topicNames;
  },
};
