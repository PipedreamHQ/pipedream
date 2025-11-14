import common from "../common/common-webhook.mjs";
import { getRelevantHeaders } from "../common/utils.mjs";

export default {
  ...common,
  key: "github-new-workflow-job-completed",
  name: "New Workflow Job Completed (Instant)",
  description: "Emit new event when a job in a workflow is completed, regardless of whether the job was successful or unsuccessful.",
  type: "source",
  version: "0.0.5",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "workflow_job",
      ];
    },
  },
  async run(event) {
    const {
      headers,
      body,
    } = event;

    // skip initial response from Github or not completed
    if (body?.zen || body?.action != "completed") {
      return;
    }

    this.$emit({
      ...getRelevantHeaders(headers),
      ...body,
    }, {
      id: headers["x-github-delivery"],
      summary: "New workflow job completed.",
      ts: new Date(),
    });
  },
  async activate() {
    const isAdmin = await this.checkAdminPermission();
    if (!isAdmin) {
      throw new Error("Webhooks are only supported on repos where you have admin access.");
    }
    await this.createWebhook();
  },
};
