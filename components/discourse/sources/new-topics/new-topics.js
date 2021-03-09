const common = require("../../common");
const discourse = require("../../discourse.app");
const isEmpty = require("lodash.isempty");

module.exports = {
  name: "New Topics",
  version: "0.0.1",
  description:
    "Emits an event every time a new topic is posted to your chosen categories",
  ...common,
  props: {
    ...common.props,
    categories: { propDefinition: [discourse, "categories"] },
  },
  hooks: {
    ...common.hooks,
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
    const { body, headers, method } = event;

    // TEST EVENTS
    if (method === "GET" && !this.isComponentInitialized()) {
      console.log("First time running event source - emitting test topics");
      const latestTopics = await this.discourse.getLatestTopics(
        this.categories
      );
      for (const topic of latestTopics) {
        this.$emit(topic, this.generateMeta(topic));
      }
      this.markComponentAsInitialized();
      return;
    }

    if (isEmpty(headers) || !event.headers["x-discourse-event-signature"]) {
      console.log("Discourse signature header not present. Exiting");
      return;
    }

    this.verifySignature(
      event.headers["x-discourse-event-signature"],
      event.body
    );

    const eventName = "topic_created";
    if (headers["x-discourse-event"] !== eventName) {
      console.log(`Not a ${eventName} event. Exiting`);
      return;
    }

    const { topic } = body;
    this.$emit(topic, this.generateMeta(topic));
  },
};
