import contentRabbitApp from "../../contentrabbit.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { createHash } from "crypto";

export default {
  key: "contentrabbit-new-post",
  name: "New or Updated Post",
  description: "Emit new event when a post is created or updated. [See the documentation](https://contentrabbitai.com/docs/api)",
  version: "0.0.2",
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
    /**
     * First 80 code points of the content.
     *
     * Iterates rather than building an array: the API does not cap post
     * content, so `Array.from(content).slice(0, 80)` would walk and allocate
     * the whole string on every emitted post to keep 80 characters. Splitting
     * by code point rather than slicing raw UTF-16 also keeps a surrogate pair
     * from being cut in half, which would leave a replacement character in the
     * summary.
     */
    summarizeContent(content) {
      let summary = "";
      let count = 0;
      for (const codePoint of content ?? "") {
        if (count >= 80) {
          break;
        }
        summary += codePoint;
        count += 1;
      }
      return summary;
    },
    generateMeta(post) {
      const revision = post.updatedAt || post.createdAt;
      // A dedupe id may not exceed 64 characters. The common `post_<cuid2>-<ISO
      // timestamp>` shape stays well under that, so keep it as-is to preserve
      // dedupe continuity for posts a source already emitted under the old
      // format; only hash the (rare) combination that would overflow the cap.
      const rawId = `${post.id}-${revision}`;
      return {
        id: rawId.length <= 64
          ? rawId
          : createHash("sha1").update(rawId).digest("hex"),
        summary: post.title || this.summarizeContent(post.content) || `Post ${post.id}`,
        ts: Date.parse(revision),
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
            updatedSince: savedTs > 0
              ? new Date(savedTs).toISOString()
              : undefined,
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
