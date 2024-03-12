import qntrl from "../../qntrl.app.mjs";

export default {
  key: "qntrl-new-job-comment",
  name: "New Job Comment",
  description: "Emit new event when a fresh comment is posted in a job. [See the documentation](https://core.qntrl.com/apidoc.html?type=reference&module=org)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    qntrl,
    db: "$.service.db",
    jobId: {
      propDefinition: [
        qntrl,
        "jobId",
      ],
    },
    commentAuthor: {
      type: "string",
      label: "Comment Author",
      description: "The author of the comment.",
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      // Emit 50 most recent comments (if available) upon first deployment
      const { comments } = await this.qntrl._makeRequest({
        method: "GET",
        path: `/jobs/${this.jobId}/comments`,
      });

      comments.slice(0, 50).forEach((comment) => {
        this.$emit(comment, {
          id: comment.id,
          summary: `New comment by ${comment.author}: ${comment.text.substring(0, 100)}...`,
          ts: Date.parse(comment.created_time),
        });
      });
    },
  },
  async run() {
    const lastEmittedTimestamp = this.db.get("lastEmittedTimestamp") || 0;
    const { comments } = await this.qntrl._makeRequest({
      method: "GET",
      path: `/jobs/${this.jobId}/comments`,
    });
    const newComments = comments.filter((c) => Date.parse(c.created_time) > lastEmittedTimestamp);

    newComments.forEach((comment) => {
      this.$emit(comment, {
        id: comment.id,
        summary: `New comment by ${comment.author}: ${comment.text.substring(0, 100)}...`,
        ts: Date.parse(comment.created_time),
      });
    });

    if (newComments.length > 0) {
      const latestTimestamp = Math.max(...newComments.map((c) => Date.parse(c.created_time)));
      this.db.set("lastEmittedTimestamp", latestTimestamp);
    }
  },
};
