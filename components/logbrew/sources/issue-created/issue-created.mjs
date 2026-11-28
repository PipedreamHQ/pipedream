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
    _getState() {
      return this.db.get("issueState");
    },
    _setState(state) {
      this.db.set("issueState", state);
    },
    // Reads every issue with an event at or after `since`, newest `last_seen_at` first, and
    // returns the newest `last_seen_at` of the first page. The first run reads one page.
    async readIssues(since) {
      const issues = [];
      let head;
      let next;
      do {
        const page = await this.logbrew.listIssues({
          params: {
            project_id: this.projectId,
            since,
            limit: 500,
            pagination: "cursor",
            cursor_time: next?.time,
            cursor_id: next?.id,
          },
        });
        head ??= page.issues[0]?.last_seen_at;
        issues.push(...page.issues);
        const following = since
          ? page.next_cursor
          : null;
        if (following && following.time === next?.time && following.id === next?.id) {
          throw new Error("LogBrew returned the same issue page cursor twice");
        }
        next = following;
      } while (next);
      const dashboardUrl = this.logbrew.getDashboardUrl();
      return {
        head,
        issues: issues.map((issue) => utils.withIssueUrl(issue, dashboardUrl)),
      };
    },
    // An issue that recurs while a poll pages moves to the head of the list, where that poll
    // already read. So the creation cutoff stays one poll behind the read point: the next poll
    // reads the issue again, and `dedupe: "unique"` drops issues already emitted.
    async emitNew({ max } = {}) {
      const state = this._getState();
      const requestedAt = new Date().toISOString();
      const {
        head, issues,
      } = await this.readIssues(state?.since);
      const cutoff = state
        ? Date.parse(state.cutoff)
        : 0;
      const fresh = issues
        .filter((issue) => Date.parse(issue.first_seen_at) >= cutoff)
        .sort((a, b) => Date.parse(a.first_seen_at) - Date.parse(b.first_seen_at));
      for (const issue of max
        ? fresh.slice(-max)
        : fresh) {
        this.$emit(issue, this.generateMeta(issue));
      }
      const readPoint = head ?? state?.since ?? requestedAt;
      this._setState({
        since: readPoint,
        cutoff: state?.since ?? readPoint,
      });
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
