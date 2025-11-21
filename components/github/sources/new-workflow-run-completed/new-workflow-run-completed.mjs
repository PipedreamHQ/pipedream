import common from "../common/common-webhook.mjs";
import { getRelevantHeaders } from "../common/utils.mjs";

export default {
  ...common,
  key: "github-new-workflow-run-completed",
  name: "New Workflow Run Completed (Instant)",
  description: "Emit new event when a GitHub Actions workflow run completes",
  type: "source",
  version: "0.0.6",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEvents() {
      return [
        "workflow_run",
      ];
    },
  },
  async run(event) {
    const {
      headers,
      body,
    } = event;

    // skip initial response from GitHub or not completed
    if (body?.zen || body?.action != "completed") {
      return;
    }

    this.$emit({
      ...getRelevantHeaders(headers),
      ...body,
    }, {
      id: headers["x-github-delivery"],
      summary: "New workflow run completed.",
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
