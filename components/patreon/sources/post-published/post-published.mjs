import base from "../common/base.mjs";

export default {
  ...base,
  key: "patreon-post-published",
  name: "Post Published",
  description: "Emit new event for published post",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Fetching historical events...");
      const response = await this.patreon.listPosts({
        campaign: this.campaign,
        params: {
          "page[count]": 25,
          "sort": "-created",
          "fields[post]": [
            "title",
            "content",
            "published_at",
            "is_paid",
            "is_public",
            "tiers",
            "url",
          ],
        },
      });
      for (const post of response.data) {
        this.emitPostEvent(post);
      }
    },
  },
  methods: {
    ...base.methods,
    getTriggerType() {
      return "posts:publish";
    },
    emitPostEvent(post) {
      this.emitEvent({
        event: post,
        id: post.id,
        summary: `New post: ${post.attributes.title}`,
        ts: Date.parse(post.attributes.published_at),
      });
    },
  },
  async run(event) {
    console.log("Emitting event...");
    const post = event.body.data;
    this.emitPostEvent(post);
  },
};
