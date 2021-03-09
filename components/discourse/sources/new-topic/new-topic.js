const axios = require("axios");
const common = require("../../common");
const isEmpty = require("lodash.isempty");

module.exports = {
  name: "New Topic",
  version: "0.0.1",
  description:
    "Emits an event every time a new topic is posted to your chosen categories",
  ...common,
  hooks: {
    async activate() {
      const secret = this.discourse.generateSecret();
      this.db.set("secret", secret);
      const { id } = await this.discourse.createHook({
        endpoint: this.http.endpoint,
        secret,
        category_ids: this.categories,
        web_hook_event_type_ids: ["1"], // https://github.com/discourse/discourse/blob/master/app/models/web_hook_event_type.rb#L4
      });
      this.db.set("hookID", id);

      // Make a test request to the component's endpoint to trigger
      // the generation of test data in the run() method
      if (!this.isComponentInitialized()) {
        await axios({ url: this.http.endpoint });
      }
    },
    async deactivate() {
      const hookID = this.db.get("hookID");
      await this.discourse.deleteHook({ hookID });
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
    if (!this.isComponentInitialized()) {
      console.log("First time running event source - emitting test topics");
      const latestTopics = await this.discourse.getLatestTopics();
      for (const topic of latestTopics) {
        const { id, title: summary, created_at } = topic;
        this.$emit(topic, {
          id,
          summary,
          ts: +new Date(created_at),
        });
      }
      this.markComponentAsInitialized();
      return;
    }

    const { body, headers } = event;

    // Check signature and body are present
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
