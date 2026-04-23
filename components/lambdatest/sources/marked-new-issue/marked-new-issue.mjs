import { axios } from "@pipedream/platform";
import lambdatest from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-marked-new-issue",
  name: "New Issue Marked in LambdaTest",
  description: "Emit a new event when an issue is marked as new in LambdaTest. [See the documentation](https://www.lambdatest.com/support/api-doc/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    lambdatest,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    priorityLevel: {
      propDefinition: [
        lambdatest,
        "priorityLevel",
      ],
    },
    status: {
      propDefinition: [
        lambdatest,
        "status",
      ],
    },
    assignee: {
      propDefinition: [
        lambdatest,
        "assignee",
      ],
    },
    filters: {
      propDefinition: [
        lambdatest,
        "filters",
      ],
      optional: true,
    },
    labels: {
      propDefinition: [
        lambdatest,
        "labels",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.run();
    },
    async activate() {
      // Perform any setup necessary when the source is activated
    },
    async deactivate() {
      // Perform any teardown necessary when the source is deactivated
    },
  },
  methods: {
    async _getIssues() {
      const issues = await this.lambdatest.emitNewIssueEvent({
        priorityLevel: this.priorityLevel,
        status: this.status,
        assignee: this.assignee,
        filters: this.filters,
        labels: this.labels,
      });
      return issues;
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  async run() {
    const issues = await this._getIssues();
    const lastTimestamp = this._getLastTimestamp();
    let maxTimestamp = lastTimestamp;

    for (const issue of issues) {
      const issueTimestamp = new Date(issue.created_at).getTime();
      if (issueTimestamp > lastTimestamp) {
        this.$emit(issue, {
          id: issue.id,
          summary: `New Issue: ${issue.title}`,
          ts: issueTimestamp,
        });
        if (issueTimestamp > maxTimestamp) {
          maxTimestamp = issueTimestamp;
        }
      }
    }

    this._setLastTimestamp(maxTimestamp);
  },
};
