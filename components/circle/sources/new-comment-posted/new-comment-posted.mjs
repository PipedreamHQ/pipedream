import circle from "../../circle.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "circle-new-comment-posted",
  name: "New Comment Posted",
  description: "Emits an event each time a new comment is posted in the selected community space. [See the documentation](https://api.circle.so)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    circle,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    community_id: {
      propDefinition: [
        circle,
        "community_id",
      ],
    },
    space_id: {
      propDefinition: [
        circle,
        "space_id",
        (c) => ({
          community_id: c.community_id,
        }),
      ],
      optional: true,
    },
    post_id: {
      propDefinition: [
        circle,
        "post_id",
        (c) => ({
          community_id: c.community_id,
          space_id: c.space_id,
        }),
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Fetching the most recent comments to set the initial state for polling
      const params = {
        community_id: this.community_id,
        space_id: this.space_id,
        post_id: this.post_id,
        sort: "created_at",
        order: "desc",
      };
      const comments = await this.circle.listComments(params);
      const latestComments = comments.slice(0, 50); // We only emit up to 50 events on deploy

      for (const comment of latestComments) {
        const meta = this.generateMeta(comment);
        this.$emit(comment, meta);
      }

      // Store the timestamp of the latest comment for the next polling interval
      if (latestComments.length > 0) {
        const after = latestComments[0].created_at;
        this.db.set("after", after);
      }
    },
  },
  methods: {
    _getAfter() {
      return this.db.get("after") ?? null;
    },
    _setAfter(after) {
      this.db.set("after", after);
    },
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: `New Comment by ${comment.user.name}: ${comment.text.substring(0, 140)}...`,
        ts: Date.parse(comment.created_at),
      };
    },
  },
  async run() {
    const after = this._getAfter();
    const params = {
      community_id: this.community_id,
      space_id: this.space_id,
      post_id: this.post_id,
      after,
    };

    // Poll for new comments
    const comments = await this.circle.listComments(params);
    if (comments.length > 0) {
      // Store the timestamp of the latest comment for the next polling interval
      this._setAfter(comments[0].created_at);

      for (const comment of comments) {
        const meta = this.generateMeta(comment);
        this.$emit(comment, meta);
      }
    }
  },
};
