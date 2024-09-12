import adhook from "../../adhook.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adhook-new-or-updated-post",
  name: "New or Updated Post",
  description: "Emit new event when a new post is created or an existing post is updated. [See the documentation](https://app.adhook.io/api-doc/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    adhook,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    postId: {
      propDefinition: [
        adhook,
        "postId",
      ],
    },
    postAuthor: {
      propDefinition: [
        adhook,
        "postAuthor",
      ],
      optional: true,
    },
    postTags: {
      propDefinition: [
        adhook,
        "postTags",
      ],
      optional: true,
    },
    isNew: {
      propDefinition: [
        adhook,
        "isNew",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const events = await this.adhook.emitPostCreatedOrUpdatedEvent({
        postId: this.postId,
        postAuthor: this.postAuthor,
        postTags: this.postTags,
        isNew: this.isNew,
      });

      for (const event of events.slice(0, 50)) {
        this.$emit(event, {
          id: event.postId,
          summary: `Post ${event.isNew
            ? "created"
            : "updated"}: ${event.postId}`,
          ts: Date.now(),
        });
      }
    },
    async activate() {
      // Activate hook logic if needed
    },
    async deactivate() {
      // Deactivate hook logic if needed
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const events = await this.adhook.emitPostCreatedOrUpdatedEvent({
      postId: this.postId,
      postAuthor: this.postAuthor,
      postTags: this.postTags,
      isNew: this.isNew,
    });

    for (const event of events) {
      const eventTimestamp = new Date(event.updatedAt).getTime();
      if (eventTimestamp > lastTimestamp) {
        this.$emit(event, {
          id: event.postId,
          summary: `Post ${event.isNew
            ? "created"
            : "updated"}: ${event.postId}`,
          ts: eventTimestamp,
        });
      }
    }

    if (events.length > 0) {
      const latestEvent = events[0];
      const latestTimestamp = new Date(latestEvent.updatedAt).getTime();
      this._setLastTimestamp(latestTimestamp);
    }
  },
};
