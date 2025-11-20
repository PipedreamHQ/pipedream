import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import googleDrive from "../../google_drive.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "google_drive-new-or-modified-comments-polling",
  name: "New or Modified Comments (Polling)",
  description: "Emit new event when a comment is created or modified in the selected file",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    googleDrive,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    drive: {
      propDefinition: [
        googleDrive,
        "watchedDrive",
      ],
      description: "Defaults to My Drive. To select a [Shared Drive](https://support.google.com/a/users/answer/9310351) instead, select it from this list.",
      optional: false,
    },
    fileId: {
      propDefinition: [
        googleDrive,
        "fileId",
        ({ drive }) => ({
          drive,
        }),
      ],
      description: "The file to watch for comments",
    },
  },
  hooks: {
    async deploy() {
      // Set the init time to now
      this._setInitTime(Date.now());

      // Emit sample comments from the file
      const commentsStream = this.googleDrive.listComments(this.fileId, null);
      let count = 0;

      for await (const comment of commentsStream) {
        if (count >= 5) break; // Limit to 5 sample comments
        await this.emitComment(comment);
        count++;
      }
    },
  },
  methods: {
    _getInitTime() {
      return this.db.get("initTime");
    },
    _setInitTime(initTime) {
      this.db.set("initTime", initTime);
    },
    _getLastCommentTime() {
      return this.db.get("lastCommentTime") || this._getInitTime();
    },
    _setLastCommentTime(commentTime) {
      this.db.set("lastCommentTime", commentTime);
    },
    generateMeta(comment) {
      const {
        id: commentId,
        content: summary,
        modifiedTime: tsString,
      } = comment;
      const ts = Date.parse(tsString);

      return {
        id: `${commentId}-${ts}`,
        summary,
        ts,
      };
    },
    async emitComment(comment) {
      const meta = this.generateMeta(comment);
      this.$emit(comment, meta);
    },
  },
  async run() {
    const lastCommentTime = this._getLastCommentTime();
    let maxCommentTime = lastCommentTime;

    const commentsStream = this.googleDrive.listComments(
      this.fileId,
      lastCommentTime,
    );

    for await (const comment of commentsStream) {
      const commentTime = Date.parse(comment.modifiedTime);
      if (commentTime <= lastCommentTime) {
        continue;
      }

      await this.emitComment(comment);

      maxCommentTime = Math.max(maxCommentTime, commentTime);
    }

    // Update the last comment time after processing all comments
    this._setLastCommentTime(maxCommentTime);
  },
  sampleEmit,
};
