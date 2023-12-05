import { axios } from "@pipedream/platform";
import browserhub from "../../browserhub.app.mjs";

export default {
  key: "browserhub-new-finished-automation-instant",
  name: "New Finished Automation (Instant)",
  description: "Emit new event when an automation has finished running. [See the documentation](https://developer.browserhub.io/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    browserhub,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    automationId: {
      propDefinition: [
        browserhub,
        "automationId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Retrieve and emit the last 50 runs (most recent) for the given automation
      const { data: runs } = await this.browserhub.listRuns({
        scraperId: this.automationId,
        page: 1,
      });
      const lastRuns = runs.slice(-50);
      for (const run of lastRuns) {
        this.$emit(run, {
          id: run.id,
          summary: `Finished automation: ${run.id}`,
          ts: Date.parse(run.created_at),
        });
      }
    },
    async activate() {
      // No webhook activation required for this component
    },
    async deactivate() {
      // No webhook deactivation required for this component
    },
  },
  async run(event) {
    // Validate the incoming webhook payload
    const {
      body, headers,
    } = event;
    if (!this.browserhub.validateWebhook(headers, body)) {
      this.http.respond({
        status: 401,
        body: "Signature validation failed",
      });
      return;
    }

    // Check if the automation status is 'finished' and emit accordingly
    const automationId = this.automationId;
    const runStatus = await this.browserhub.getRunStatus({
      automationId,
    });

    if (runStatus.status === "finished") {
      this.$emit(runStatus, {
        id: runStatus.id,
        summary: `Automation ${runStatus.id} finished`,
        ts: Date.parse(runStatus.finished_at),
      });

      // Respond to the HTTP request
      this.http.respond({
        status: 200,
        body: "OK",
      });
    } else {
      // If the automation is not finished, respond with a 204 No Content
      this.http.respond({
        status: 204,
      });
    }
  },
};
