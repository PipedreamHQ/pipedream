import contentRabbitApp from "../../contentrabbit.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "contentrabbit-new-post",
  name: "New or Updated Post",
  description: "Emit new event when a post is created or updated. [See the documentation](https://contentrabbitai.com/api/public/v1/docs#/Posts/listPosts)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    contentRabbitApp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    status: {
      propDefinition: [
        contentRabbitApp,
        "status",
      ],
      description: "Filter by post status.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25, true);
    },
  },
  methods: {
    _getSavedTs() {
      return this.db.get("savedTs") ?? 0;
    },
    _setSavedTs(ts) {
      this.db.set("savedTs", ts);
    },
    generateMeta(post) {
      return {
        id: `${post.id}-${post.updatedAt || post.createdAt}`,
        summary: post.title || post.content?.slice(0, 80) || `Post ${post.id}`,
        ts: Date.parse(post.updatedAt || post.createdAt),
      };
    },
    async processEvent(max, isDeploy = false) {
      const limit = max ?? 100;
      const savedTs = this._getSavedTs();
      let maxTs = savedTs;

      if (isDeploy) {
        const response = await this.contentRabbitApp.listPosts({
          params: {
            status: this.status,
            limit,
            sortBy: "updatedAt",
            sortOrder: "desc",
          },
        });
        const posts = response.data ?? [];
        for (const post of posts) {
          const ts = Date.parse(post.updatedAt || post.createdAt);
          this.$emit(post, this.generateMeta(post));
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
        // If deploy found no posts, bookmark "now" so the next poll doesn't
        // fall back to an unbounded, full-history fetch.
        if (posts.length === 0) {
          maxTs = Date.now();
        }
        this._setSavedTs(maxTs);
        return;
      }

      // Page through every post updated since the last poll, oldest first, so
      // more than `limit` updates in one interval can't skip past the checkpoint.
      let page = 1;
      for (;;) {
        const response = await this.contentRabbitApp.listPosts({
          params: {
            status: this.status,
            limit,
            page,
            sortBy: "updatedAt",
            sortOrder: "asc",
            updatedSince: savedTs > 0 ? new Date(savedTs).toISOString() : undefined,
          },
        });

        const posts = response.data ?? [];
        for (const post of posts) {
          const ts = Date.parse(post.updatedAt || post.createdAt);
          this.$emit(post, this.generateMeta(post));
          if (ts > maxTs) {
            maxTs = ts;
          }
        }

        const totalPages = response.paging?.pages ?? 1;
        if (posts.length < limit || page >= totalPages) {
          break;
        }
        page += 1;
      }

      this._setSavedTs(maxTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};