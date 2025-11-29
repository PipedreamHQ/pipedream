export default {
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
};
