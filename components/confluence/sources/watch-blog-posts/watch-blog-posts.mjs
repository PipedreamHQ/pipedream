import axios from "@pipedream/platform";
import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-watch-blog-posts",
  name: "Watch Blog Posts",
  description: "Emits an event when a blog post is created or updated",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    confluence,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    spaceKey: confluence.propDefinitions.spaceKey,
    blogPostKey: {
      ...confluence.propDefinitions.blogPostKey,
      optional: true,
    },
  },
  methods: {
    _getBaseURL() {
      return "https://api.atlassian.com";
    },
    _getHeaders() {
      return {
        Authorization: `Bearer ${this.confluence.$auth.oauth_access_token}`,
      };
    },
    async _getBlogPosts(spaceKey) {
      return this.confluence._makeRequest({
        method: "GET",
        path: "/wiki/rest/api/content",
        params: {
          spaceKey,
          type: "blogpost",
          expand: "version",
        },
      });
    },
    generateMeta(data) {
      const ts = new Date(data.version.when).getTime();
      return {
        id: data.id,
        summary: data.title,
        ts,
      };
    },
  },
  async run() {
    const blogPosts = await this._getBlogPosts(this.spaceKey);
    blogPosts.forEach((blogPost) => {
      if (this.blogPostKey && this.blogPostKey !== blogPost.id) return;
      const meta = this.generateMeta(blogPost);
      this.$emit(blogPost, meta);
    });
  },
};
