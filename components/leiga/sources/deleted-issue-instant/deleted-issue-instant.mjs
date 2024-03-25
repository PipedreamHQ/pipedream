import leiga from "../../leiga.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "leiga-deleted-issue-instant",
  name: "Deleted Issue Instant",
  description: "Emit new event when an issue is deleted in Leiga. You need to input the particular issue you want to detect for deletes.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    leiga: {
      type: "app",
      app: "leiga",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    issueId: {
      type: "string",
      label: "Issue ID",
      description: "The specific issue ID you want to track for updates or deletions.",
    },
  },
  hooks: {
    async deploy() {
      // Attempt to fetch the issue to see if it already exists at the time of deployment
      try {
        await this.leiga.getIssue({
          issueId: this.issueId,
        });
        // If found, save the issue ID to db
        this.db.set("issueId", this.issueId);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          throw new Error(`Issue with ID ${this.issueId} not found during deploy.`);
        }
        throw new Error("An error occurred while fetching the issue.");
      }
    },
    async activate() {
      console.log(`Monitoring issue ID ${this.issueId} for deletion.`);
    },
    async deactivate() {
      this.db.set("issueId", null);
      console.log(`Stopped monitoring issue ID ${this.issueId} for deletion.`);
    },
  },
  async run(event) {
    const issueId = this.db.get("issueId");
    if (!issueId) {
      throw new Error("No issue is being monitored for deletion. Please check the configuration.");
    }
    try {
      await this.leiga.getIssue({
        issueId: issueId,
      });
      // If the request succeeds, the issue has not been deleted, do nothing
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If a 404 error is returned, the issue has been deleted
        this.$emit({
          message: `Issue with ID ${issueId} has been deleted.`,
        }, {
          id: issueId,
          summary: `Issue ${issueId} deleted`,
          ts: Date.now(),
        });
        this.db.set("issueId", null); // Stop monitoring since the issue is deleted
      } else {
        console.error("An error occurred while checking the issue status:", error);
        // Handle other errors or network issues
      }
    }
  },
};
