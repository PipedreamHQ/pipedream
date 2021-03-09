const common = require("../../common");
const discourse = require("../../discourse.app");

module.exports = {
  name: "New Posts",
  key: "disourse-new-posts",
  version: "0.0.3",
  description:
    "Emits an event every time a new post is added to a topic in one of your chosen categories",
  ...common,
  props: {
    ...common.props,
    categories: { propDefinition: [discourse, "categories"] },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      const latestPosts = await this.discourse.getLatestPosts(this.categories);
      for (const post of latestPosts) {
        this.$emit(post, this.generateMeta(post));
      }
    },
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
    this.validateEventAndEmit(event, "post_created", "post");
  },
};
