import kadoa from "../../kadoa.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kadoa-new-workflow-finished-instant",
  name: "New Workflow Finished (Instant)",
  description: "Emit new event when a Kadoa workflow finishes. [See the documentation](https://api.kadoa.com/api-docs/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kadoa: {
      type: "app",
      app: "kadoa",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    workflowId: {
      propDefinition: [
        kadoa,
        "workflowId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent workflow runs history to emit on deploy
      const history = await this.kadoa.getWorkflowRunsHistory({
        workflowId: this.workflowId,
      });
      const recentHistory = history.slice(0, 50);
      for (const run of recentHistory) {
        this.$emit(run, {
          id: run.id,
          summary: `Workflow run ${run.id} finished`,
          ts: Date.parse(run.finishedAt),
        });
      }
    },
  },
  async run(event) {
    const { body } = event;
    // Assuming the webhook sends the workflow ID and status
    if (body.workflowId === this.workflowId && body.status === "finished") {
      this.$emit(body, {
        id: body.runId,
        summary: `Workflow ${body.workflowId} run finished`,
        ts: Date.parse(body.finishedAt) || +new Date(),
      });
    } else {
      this.http.respond({
        status: 404,
        body: "Not found",
      });
    }
  },
};
