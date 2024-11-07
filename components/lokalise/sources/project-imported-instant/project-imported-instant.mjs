import lokalise from "../../lokalise.app.mjs";

export default {
  key: "lokalise-project-imported-instant",
  name: "Project Imported Instant",
  description: "Emit new event when data is imported into a project",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    lokalise,
    projectId: {
      propDefinition: [
        lokalise,
        "projectId",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      const params = {
        filter_datetime_created_start: new Date().toISOString(),
      };
      const results = await this.lokalise.importData(params);
      for (const result of results.slice(0, 50).reverse()) {
        this.$emit(result, {
          id: result.task_id,
          summary: `New data imported into project ${this.projectId}`,
          ts: Date.parse(result.created_at),
        });
      }
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.timestamp;
    const params = {
      filter_datetime_created_start: new Date(lastRunTime).toISOString(),
    };
    const results = await this.lokalise.importData(params);
    for (const result of results) {
      this.$emit(result, {
        id: result.task_id,
        summary: `New data imported into project ${this.projectId}`,
        ts: Date.now(),
      });
    }
    this.db.set("lastRunTime", this.timer.timestamp);
  },
};
