import nethuntCrm from "../../nethunt_crm.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "nethunt_crm-comment-created",
  name: "New Comment Created",
  description: "Emit new event for every created comment. [See docs here](https://nethunt.com/integration-api#new-comment)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    nethuntCrm,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    folderId: {
      propDefinition: [
        nethuntCrm,
        "folderId",
      ],
    },
  },
  methods: {
    _getSince() {
      return this.db.get("since");
    },
    _setSince(since) {
      this.db.set("since", since);
    },
  },
  async run() {
    const nextSince = new Date();
    const since = this._getSince();

    const comments = await this.nethuntCrm.listRecentlyCreatedCommentsInFolder({
      folderId: this.folderId,
      params: {
        since,
      },
    });

    this._setSince(nextSince);

    for (const comment of comments) {
      this.$emit(comment, {
        id: comment.id,
        summary: `New comment: ${comment.text}`,
        ts: comment.createdAt,
      });
    }
  },
};
