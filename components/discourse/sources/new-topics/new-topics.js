const common = require("../../common");
const discourse = require("../../discourse.app");

module.exports = {
  name: "New Topics",
  key: "disourse-new-topics",
  version: "0.0.3",
  description:
    "Emits an event every time a new topic is posted to your chosen categories",
  ...common,
  props: {
    ...common.props,
    categories: { propDefinition: [discourse, "categories"] },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      const latestTopics = await this.discourse.getLatestTopics(
        this.categories
      );
      for (const topic of latestTopics) {
        this.$emit(topic, this.generateMeta(topic));
      }
    },
    async activate() {
      await this.activate({
        category_ids: this.categories,
        web_hook_event_type_ids: ["1"], // https://github.com/discourse/discourse/blob/master/app/models/web_hook_event_type.rb#L4
      });
    },
  },
  methods: {
    ...common.methods,
    generateMeta(topic) {
      const { id, title: summary, created_at } = topic;
      return {
        id,
        summary,
        ts: +new Date(created_at),
      };
    },
  },
  async run(event) {
    this.validateEventAndEmit(event, "topic_created", "topic");
  },
};
