import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import redmine from "../../redmine.app.mjs";

export default {
  key: "redmine-issue-created",
  name: "New Issue Created",
  description: "Emit new event when a new issue is created in Redmine",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    redmine,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        redmine,
        "projectId",
      ],
    },
  },
  methods: {
    _getIssueId() {
      return this.db.get("issueId") || 0;
    },
    _setIssueId(id) {
      this.db.set("issueId", id);
    },
  },
  async run() {
    const params = {
      projectId: this.projectId,
    };

    while (true) {
      const { issues } = await this.redmine.getIssueCreated(params);
      if (issues.length === 0) {
        console.log("No new issues found.");
        break;
      }

      let maxIssueId = this._getIssueId();
      for (const issue of issues) {
        if (issue.id > maxIssueId) {
          maxIssueId = issue.id;
          this.$emit(issue, {
            id: issue.id,
            summary: `New issue: ${issue.subject}`,
            ts: Date.parse(issue.created_on),
          });
        }
      }

      this._setIssueId(maxIssueId);
      params.offset = (params.offset || 0) + issues.length;
    }
  },
};
