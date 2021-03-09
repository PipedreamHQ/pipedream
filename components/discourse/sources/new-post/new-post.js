const common = require("../../common");
const isEmpty = require("lodash.isempty");

module.exports = {
  name: "New Posts",
  version: "0.0.1",
  description:
    "Emits an event every time a new post is added to a topic in one of your chosen categories",
  ...common,
  hooks: {
    ...common.hooks,
    async activate() {
      await this.activate({
        category_ids: this.categories,
        web_hook_event_type_ids: ["2"], // https://github.com/discourse/discourse/blob/master/app/models/web_hook_event_type.rb#L5
      });
    },
  },
  methods: {
    ...common.methods,
    generateMeta(post) {
      const { id, raw, created_at } = post;
      const MAX_LENGTH = 40;
      return {
        id,
        summary:
          raw.length > MAX_LENGTH ? `${raw.slice(0, MAX_LENGTH)}...` : raw, // truncate long text
        ts: +new Date(created_at),
      };
    },
  },
  async run(event) {
    const { body, headers, method } = event;

    // TEST EVENTS
    if (method === "GET" && !this.isComponentInitialized()) {
      console.log("First time running event source - emitting test posts");
      const latestPosts = await this.discourse.getLatestPosts(this.categories);
      for (const post of latestPosts) {
        this.$emit(post, this.generateMeta(post));
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

    const eventName = "post_created";
    if (headers["x-discourse-event"] !== eventName) {
      console.log(`Not a ${eventName} event. Exiting`);
      return;
    }

    const { post } = body;
    this.$emit(post, this.generateMeta(post));
  },
};
