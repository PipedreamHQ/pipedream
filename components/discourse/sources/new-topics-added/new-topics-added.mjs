import common from "../../common.mjs";
import discourse from "../../discourse.app.mjs";

export default {
  name: "New Topics (Instant)",
  key: "discourse-new-topics-added",
  version: "0.2.2",
  type: "source",
  description: "Emit new topics posted to your chosen categories",
  ...common,
  props: {
    ...common.props,
    categories: {
      propDefinition: [
        discourse,
        "categories",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      const latestTopics = await this.discourse.getLatestTopics(
        this.categories,
      );
      for (const topic of latestTopics) {
        this.$emit(topic, this.generateMeta(topic));
      }
    },
    async activate() {
      await this.activate({
        category_ids: this.categories,
        web_hook_event_type_ids: [
          "1",
        ], // https://github.com/discourse/discourse/blob/master/app/models/web_hook_event_type.rb#L4
      });
    },
  },
  methods: {
    ...common.methods,
    generateMeta(topic) {
      const {
        id,
        title: summary,
        created_at: createdAt,
      } = topic;
      return {
        id,
        summary,
        ts: +new Date(createdAt),
      };
    },
  },
  async run(event) {
    this.validateEventAndEmit(event, "topic_created", "topic");
  },
};
