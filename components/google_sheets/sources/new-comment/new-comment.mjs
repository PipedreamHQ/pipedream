import app from "../../google_sheets.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "google_sheets-new-comment",
  name: "New Comment (Instant)",
  description: "Emit new event each time a comment is added to a spreadsheet.",
  version: "0.2.0",
  dedupe: "unique",
  type: "source",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    sheetID: {
      propDefinition: [
        app,
        "sheetID",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: `New Comment: ${comment.content}`,
        ts: Date.parse(comment.createdTime),
      };
    },
    async processSpreadsheet() {
      const comments = [];
      const lastTs = this._getLastTs();

      try {
        const results = this.app.listComments(this.sheetID, lastTs);
        for await (const comment of results) {
          comments.push(comment);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
      if (!comments.length) {
        console.log("No new comments since last check");
        return;
      }
      this._setLastTs(comments[0].createdTime);
      comments.reverse().forEach((comment) => {
        const meta = this.generateMeta(comment);
        this.$emit(comment, meta);
      });
    },
  },
  async run() {
    // Component was invoked by timer
    await this.processSpreadsheet();
  },
  sampleEmit,
};
