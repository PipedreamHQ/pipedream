import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../kafka.app.mjs";

export default {
  key: "kafka-new-topic-created",
  name: "New Topic Created",
  description: "Emit new event when a new Kafka topic is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    topicNamePattern: {
      type: "string",
      label: "Topic Name Pattern",
      description: "Only emit events for topics that match this pattern. E.g., `^my-topic-\\d+$`",
      optional: true,
    },
  },
  methods: {
    topicMatchesPattern(topic) {
      const { topicNamePattern } = this;
      if (!topicNamePattern) {
        return true;
      }
      const pattern = new RegExp(topicNamePattern);
      return pattern.test(topic);
    },
    emitTopics(topics) {
      topics.forEach((topic) => {
        this.$emit({
          topic,
        }, {
          id: topic,
          summary: `New Topic: ${topic}`,
          ts: Date.now(),
        });
      });
    },
  },
  async run() {
    const {
      app,
      topicMatchesPattern,
      emitTopics,
    } = this;

    const topics = await app.listTopics();
    const topicsToEmit = topics.filter(topicMatchesPattern);
    emitTopics(topicsToEmit);
  },
};
