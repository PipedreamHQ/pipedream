import httpBase from "../common/http-based/sheet.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...httpBase,
  key: "google_sheets-new-comment",
  name: "New Comment (Instant)",
  description: "Emit new event each time a comment is added to a spreadsheet.",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  methods: {
    ...httpBase.methods,
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
    takeSheetSnapshot() {},
    getSheetId() {
      return this.sheetID.toString();
    },
    async processSpreadsheet() {
      const comments = [];
      const lastTs = this._getLastTs();
      const results = this.googleSheets.listComments(this.sheetID, lastTs);
      for await (const comment of results) {
        comments.push(comment);
      }
      if (!comments.length) {
        return;
      }
      this._setLastTs(comments[0].createdTime);
      comments.reverse().forEach((comment) => {
        const meta = this.generateMeta(comment);
        this.$emit(comment, meta);
      });
    },
  },
  async run(event) {
    if (event.timestamp) {
      // Component was invoked by timer
      return this.renewSubscription();
    }

    if (!this.isEventRelevant(event)) {
      console.log("Sync notification, exiting early");
      return;
    }

    await this.processSpreadsheet();
  },
  sampleEmit,
};
