import leiga from "../../leiga.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "leiga-updated-issue-instant",
  name: "Updated Issue Instant",
  description: "Emit new event when an existing issue is updated in Leiga.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    leiga: {
      type: "app",
      app: "leiga",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    issueId: {
      propDefinition: [
        leiga,
        "issueId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch the current state of the issue to store as the baseline for comparison
      const issue = await this.leiga.getIssue({
        issueId: this.issueId,
      });
      this.db.set("issueState", issue);
    },
  },
  async run(event) {
    const currentIssueState = await this.leiga.getIssue({
      issueId: this.issueId,
    });
    const previousIssueState = this.db.get("issueState");

    // Compare the previous state with the current state
    if (JSON.stringify(currentIssueState) !== JSON.stringify(previousIssueState)) {
      this.$emit(currentIssueState, {
        id: currentIssueState.id,
        summary: `Issue ${currentIssueState.id} updated`,
        ts: Date.now(),
      });

      // Update the stored state to the current state for future comparisons
      this.db.set("issueState", currentIssueState);
    }
  },
};
