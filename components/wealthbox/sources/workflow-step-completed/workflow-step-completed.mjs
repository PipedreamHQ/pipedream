import common from "../common/common.mjs";
import { DEFAULT_HISTORICAL_LIMIT } from "../../common/constants.mjs";

const PER_PAGE = 25;

export default {
  ...common,
  key: "wealthbox-workflow-step-completed",
  name: "Workflow Step Completed",
  description: "Emit new event each time a workflow step transitions to a completed state. Polls the Wealthbox workflows endpoint, tracks by `updated_at`, and deduplicates by step id. [See the documentation](https://dev.wealthbox.com/#workflows-retrieve-all-workflows-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastUpdated() {
      return this.db.get("lastUpdated");
    },
    _setLastUpdated(ts) {
      this.db.set("lastUpdated", ts);
    },
    async fetchCompletedSteps(since) {
      let page = 1;
      const completedSteps = [];

      do {
        const response = await this.wealthbox.listWorkflows({
          params: {
            per_page: PER_PAGE,
            page,
            status: "completed",
          },
        });
        const workflows = response?.workflows || [];
        if (!workflows.length) {
          break;
        }

        for (const workflow of workflows) {
          const steps = workflow.steps || workflow.workflow_steps || [];
          for (const step of steps) {
            if (!step.updated_at) {
              continue;
            }
            const ts = Date.parse(step.updated_at) / 1000;
            if (ts > since) {
              completedSteps.push({
                ...step,
                workflow_id: workflow.id,
                workflow_name: workflow.name,
              });
            }
          }
        }

        if (workflows.length < PER_PAGE) {
          break;
        }
        page++;
      } while (true);

      return completedSteps;
    },
    generateMeta(step) {
      return {
        id: `${step.workflow_id}-${step.id}`,
        summary: `Workflow Step Completed: ${step.name || step.id}`,
        ts: Date.parse(step.updated_at) / 1000,
      };
    },
    // Not used directly - workflow-step-completed overrides run() and hooks.deploy
    getEvents() {
      return [];
    },
  },
  hooks: {
    async deploy() {
      const steps = await this.fetchCompletedSteps(0);
      const recent = steps.slice(0, DEFAULT_HISTORICAL_LIMIT);
      if (!recent.length) {
        return;
      }
      let maxTs = 0;
      for (const step of recent) {
        this.$emit(step, this.generateMeta(step));
        const ts = Date.parse(step.updated_at) / 1000;
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
      this._setLastUpdated(maxTs);
    },
  },
  async run() {
    const lastUpdated = this._getLastUpdated() || 0;
    let maxUpdated = lastUpdated;

    const steps = await this.fetchCompletedSteps(lastUpdated);
    for (const step of steps) {
      this.$emit(step, this.generateMeta(step));
      const ts = Date.parse(step.updated_at) / 1000;
      if (ts > maxUpdated) {
        maxUpdated = ts;
      }
    }

    this._setLastUpdated(maxUpdated);
  },
};
