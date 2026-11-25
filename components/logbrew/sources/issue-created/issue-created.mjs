import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "logbrew-issue-created",
  name: "New Issue",
  description: "Emit new event when LogBrew groups an error it has not seen before into a new issue. [See the documentation](https://docs.logbrew.co/reference/telemetry-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems(cursor) {
      const issues = await this.logbrew.listIssues({
        params: {
          project_id: this.projectId,
          since: cursor,
          limit: 500,
        },
      });
      return issues.map((issue) => this.logbrew.withUrl(issue));
    },
    getTimestamp(issue) {
      return issue.first_seen_at;
    },
    generateMeta(issue) {
      return {
        id: issue.id,
        summary: `New issue: ${issue.title}`,
        ts: Date.parse(issue.first_seen_at),
      };
    },
  },
  sampleEmit,
};
