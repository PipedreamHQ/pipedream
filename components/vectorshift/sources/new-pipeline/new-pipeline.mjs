import vectorshift from "../../vectorshift.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "vectorshift-new-pipeline",
  name: "New Pipeline Created",
  description: "Emit new event when a new pipeline is created in VectorShift. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vectorshift: {
      type: "app",
      app: "vectorshift",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      try {
        const pipelines = await this.vectorshift.listPipelines();
        if (!pipelines || pipelines.length === 0) {
          return;
        }

        // Sort pipelines by creation time descending
        pipelines.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const recentPipelines = pipelines.slice(0, 50);

        let latestTimestamp = 0;

        for (const pipeline of recentPipelines) {
          const timestamp = pipeline.created_at
            ? Date.parse(pipeline.created_at)
            : Date.now();
          latestTimestamp = Math.max(latestTimestamp, timestamp);

          this.$emit(pipeline, {
            id: pipeline.id,
            summary: `New Pipeline Created: ${pipeline.name}`,
            ts: timestamp,
          });
        }

        await this.db.set("last_timestamp", latestTimestamp);
      } catch (error) {
        this.$emit(
          {
            error: error.message,
          },
          {
            summary: "Error during deploy",
            ts: Date.now(),
          },
        );
      }
    },
    async activate() {
      // No activation steps needed for polling source
    },
    async deactivate() {
      // No deactivation steps needed for polling source
    },
  },
  async run() {
    try {
      const pipelines = await this.vectorshift.listPipelines();
      if (!pipelines || pipelines.length === 0) {
        return;
      }

      const lastTimestamp = (await this.db.get("last_timestamp")) || 0;

      // Sort pipelines by creation time ascending
      pipelines.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      let newLastTimestamp = lastTimestamp;

      for (const pipeline of pipelines) {
        const pipelineTimestamp = pipeline.created_at
          ? Date.parse(pipeline.created_at)
          : Date.now();
        if (pipelineTimestamp > lastTimestamp) {
          this.$emit(pipeline, {
            id: pipeline.id,
            summary: `New Pipeline Created: ${pipeline.name}`,
            ts: pipelineTimestamp,
          });

          if (pipelineTimestamp > newLastTimestamp) {
            newLastTimestamp = pipelineTimestamp;
          }
        }
      }

      if (newLastTimestamp > lastTimestamp) {
        await this.db.set("last_timestamp", newLastTimestamp);
      }
    } catch (error) {
      this.$emit(
        {
          error: error.message,
        },
        {
          summary: "Error during run",
          ts: Date.now(),
        },
      );
    }
  },
};
