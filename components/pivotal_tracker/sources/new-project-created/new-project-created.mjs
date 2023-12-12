import pivotalTracker from "../../pivotal_tracker.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Project Created",
  key: "pivotal_tracker-new-project-created",
  description: "Emit new event when a new project is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    pivotalTracker,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated") || 0;
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    generateMeta(project) {
      return {
        id: project.id,
        summary: project.name,
        ts: Date.parse(project.created_at),
      };
    },
  },
  async run() {
    const lastCreated = this._getLastCreated();
    let maxCreated = lastCreated;

    const projects = await this.pivotalTracker.listProjects();

    for (const project of projects) {
      const projectCreated = Date.parse(project.created_at);
      if (projectCreated > lastCreated) {
        const meta = this.generateMeta(project);
        this.$emit(project, meta);
        if (projectCreated > maxCreated) {
          maxCreated = Date.parse(project.created_at);
        }
      }
    }

    this._setLastCreated(maxCreated);
  },
};
