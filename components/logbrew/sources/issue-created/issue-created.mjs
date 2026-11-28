import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";
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
      const issues = [];
      let next;
      do {
        const page = await this.logbrew.listIssues({
          params: {
            project_id: this.projectId,
            since: cursor,
            limit: 500,
            pagination: "cursor",
            cursor_time: next?.time,
            cursor_id: next?.id,
          },
        });
        issues.push(...page.issues);
        // The first run reads one page: its issues are history, not new events.
        next = cursor
          ? page.next_cursor
          : null;
      } while (next);
      const dashboardUrl = this.logbrew.getDashboardUrl();
      return issues.map((issue) => utils.withIssueUrl(issue, dashboardUrl));
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
