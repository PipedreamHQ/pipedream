import skyvern from "../../skyvern.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "skyvern-new-or-updated-workflow",
  name: "New or Updated Workflow",
  description: "Emits a new event when a workflow is created or updated in Skyvern. [See the documentation](https://docs.skyvern.com/workflows/getting-workflows)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    skyvern,
    db: "$.service.db",
    workspace: {
      propDefinition: [
        skyvern,
        "workspace",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastWorkflowVersion() {
      return this.db.get("lastWorkflowVersion") || {};
    },
    _setLastWorkflowVersion(workflows) {
      const lastWorkflowVersion = workflows.reduce((acc, workflow) => {
        acc[workflow.workflow_id] = workflow.version;
        return acc;
      }, {});
      this.db.set("lastWorkflowVersion", lastWorkflowVersion);
    },
  },
  hooks: {
    async deploy() {
      const workflows = await this.skyvern.listWorkflows({
        workspace: this.workspace,
      });
      const last50Workflows = workflows.slice(-50);

      for (const workflow of last50Workflows) {
        this.$emit(workflow, {
          id: workflow.workflow_id,
          summary: `New or Updated Workflow: ${workflow.title}`,
          ts: Date.now(),
        });
      }

      this._setLastWorkflowVersion(last50Workflows);
    },
    async activate() {
      // Add any logic for when the component is activated
    },
    async deactivate() {
      // Add any logic for when the component is deactivated
    },
  },
  async run() {
    const lastWorkflowVersion = this._getLastWorkflowVersion();
    const workflows = await this.skyvern.listWorkflows({
      workspace: this.workspace,
    });

    for (const workflow of workflows) {
      const previousVersion = lastWorkflowVersion[workflow.workflow_id];

      if (!previousVersion || workflow.version > previousVersion) {
        this.$emit(workflow, {
          id: workflow.workflow_id,
          summary: `New or Updated Workflow: ${workflow.title}`,
          ts: Date.now(),
        });

        lastWorkflowVersion[workflow.workflow_id] = workflow.version;
      }
    }

    this._setLastWorkflowVersion(workflows);
  },
};
