import blogify from "../../blogify.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "blogify-new-blog-instant",
  name: "New Blog (Instant)",
  description: "Emit new events when a blog is created. [See the documentation](https://blogify.ai/developer/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    blogify,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
  },
  methods: {
    filterEvent() {
      return true;
    },
  },
  hooks: {
    async activate() {
      await this.blogify.createWebhook({
        data: {
          hookUrl: this.http.endpoint,
        },
      });
    },
    async deactivate() {
      await this.blogify.deleteWebhook({
        data: {
          hookUrl: this.http.endpoint,
        },
      });
    },
  },
  async run({ body }) {
    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${body.title}- ${ts}`,
      summary: `New blog: ${body.title}`,
      ts: ts,
    });
  },
  sampleEmit,
};
