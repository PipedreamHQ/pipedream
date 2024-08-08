import blogify from "../../blogify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "blogify-new-blog-instant",
  name: "New Blog Instant",
  description: "Emit new events when a blog is created. [See the documentation](https://blogify.ai/developer/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    blogify: {
      type: "app",
      app: "blogify",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const blogs = await this.blogify.emitNewBlogEvent();
      for (const blog of blogs) {
        this.$emit(blog, {
          id: blog.id,
          summary: `New blog: ${blog.title}`,
          ts: Date.parse(blog.createdAt),
        });
      }
    },
    async activate() {
      const webhookId = await this.blogify._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url: this.http.endpoint,
          event: "blog.created",
        },
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.blogify._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    this.$emit(event.body, {
      id: event.body.id,
      summary: `New blog: ${event.body.title}`,
      ts: Date.parse(event.body.createdAt),
    });
  },
};
