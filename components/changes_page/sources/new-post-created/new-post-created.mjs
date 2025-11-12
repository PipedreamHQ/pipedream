import changesPage from "../../changes_page.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "changes_page-new-post-created",
  name: "New Post Created",
  description: "Emit new event when a new post is created. [See the documentation](https://docs.changes.page/docs/api/page#get-all-posts)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    changesPage,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    generateMeta(post) {
      return {
        id: post.id,
        summary: post.title,
        ts: Date.parse(post.created_at),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const results = this.changesPage.paginate({
        fn: this.changesPage.listPosts,
        max,
      });
      const posts = [];
      for await (const post of results) {
        if (Date.parse(post.created_at) > lastTs) {
          posts.push(post);
        } else {
          break;
        }
      }
      if (!posts.length) {
        return;
      }
      this._setLastTs(Date.parse(posts[0].created_at));
      posts.reverse().forEach((post) => {
        const meta = this.generateMeta(post);
        this.$emit(post, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
