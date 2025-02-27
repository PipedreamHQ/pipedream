import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import gem from "../../gem.app.mjs";

export default {
  key: "gem-new-stage-change",
  name: "New Stage Change",
  description: "Emit a new event when a candidate's stage changes in a hiring pipeline. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    gem: {
      type: "app",
      app: "gem",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    monitorPipelines: {
      propDefinition: [
        "gem",
        "monitorPipelines",
      ],
    },
    monitorStages: {
      propDefinition: [
        "gem",
        "monitorStages",
        (c) => ({
          monitorPipelines: c.monitorPipelines,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      const candidates = await this.gem.listCandidates({
        monitorPipelines: this.monitorPipelines,
      });

      const stageData = {};

      const sortedCandidates = candidates.sort((a, b) => new Date(b.last_updated_at) - new Date(a.last_updated_at));

      const recentCandidates = sortedCandidates.slice(0, 50);

      for (const candidate of recentCandidates) {
        this.$emit(
          candidate,
          {
            id: candidate.id,
            summary: `Candidate ${candidate.firstName} ${candidate.lastName} moved to stage ${candidate.stage}.`,
            ts: Date.parse(candidate.last_updated_at) || Date.now(),
          },
        );
        stageData[candidate.id] = candidate.stage;
      }

      await this.db.set("candidates", stageData);
    },
    async activate() {
      // No webhook setup required for polling source
    },
    async deactivate() {
      // No webhook teardown required for polling source
    },
  },
  async run() {
    const lastStageData = (await this.db.get("candidates")) || {};
    const candidates = await this.gem.listCandidates({
      monitorPipelines: this.monitorPipelines,
    });

    const newStageData = {};

    for (const candidate of candidates) {
      newStageData[candidate.id] = candidate.stage;

      const previousStage = lastStageData[candidate.id];
      if (previousStage && previousStage !== candidate.stage) {
        if (
          this.monitorStages.length === 0 ||
          this.monitorStages.includes(candidate.stage)
        ) {
          this.$emit(
            candidate,
            {
              id: candidate.id,
              summary: `Candidate ${candidate.firstName} ${candidate.lastName} moved to stage ${candidate.stage}.`,
              ts: Date.parse(candidate.last_updated_at) || Date.now(),
            },
          );
        }
      }
    }

    await this.db.set("candidates", newStageData);
  },
};
