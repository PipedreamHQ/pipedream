import kiteSuite from "../../kite_suite.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "kite_suite-new-task-created",
  name: "New Task Created",
  description: "Emit new event when a new task is created in a Project",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    kiteSuite,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    workspace: {
      propDefinition: [
        kiteSuite,
        "workspace",
      ],
    },
    projectId: {
      propDefinition: [
        kiteSuite,
        "projectId",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(task) {
      return {
        id: task._id,
        summary: task.summary,
        ts: Date.parse(task.createdAt),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const { data: tasks } = await this.kiteSuite.listTasks({
      workspace: this.workspace,
      projectId: this.projectId,
    });

    for (const task of tasks) {
      const ts = Date.parse(task.createdAt);
      if (ts > lastTs) {
        const meta = this.generateMeta(task);
        this.$emit(task, meta);
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
    }

    this._setLastTs(maxTs);
  },
};
