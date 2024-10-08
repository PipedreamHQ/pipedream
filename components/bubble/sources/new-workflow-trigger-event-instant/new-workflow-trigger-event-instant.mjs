import bubble from "../../bubble.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bubble-new-workflow-trigger-event-instant",
  name: "New Workflow Trigger Event",
  description: "Emits new event when a Bubble workflow that incorporates the plugin action is initiated. [See the documentation](https://manual.bubble.io/core-resources/api/the-bubble-api/the-data-api/data-api-requests)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    bubble,
    db: "$.service.db",
    workflowId: {
      propDefinition: [
        bubble,
        "workflowId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvents();
    },
    async activate() {
      // Setup webhook or other necessary activation logic if required
    },
    async deactivate() {
      // Clean up webhook or other deactivation steps if required
    },
  },
  methods: {
    async emitEvents() {
      const events = await this.bubble.listenForWorkflow({
        workflowId: this.workflowId,
      });

      for (const event of events.reverse()) {
        this.$emit(event, {
          summary: `New workflow event for ${event.workflow_id}`,
          ts: new Date(event.timestamp).getTime(),
        });
      }
    },
  },
  async run() {
    await this.emitEvents();
  },
};
