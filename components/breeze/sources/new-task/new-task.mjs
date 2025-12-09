import breeze from "../../breeze.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "breeze-new-task",
  name: "New Task",
  description: "Emit new event when a new task is created. [See documentation](https://www.breeze.pm/api#:~:text=Get%20cards)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    breeze,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Breeze API for new tasks",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        breeze,
        "projectId",
      ],
    },
  },
  methods: {
    generateMeta(task) {
      const ts = Date.parse(task.created_at || "") || Date.now();
      return {
        id: task.id,
        summary: `New task created: ${task.name || task.id}`,
        ts,
      };
    },
  },
  async run() {
    const lastTaskId = this.db.get("lastTaskId");

    const tasks = await this.breeze.getTasks({
      projectId: this.projectId,
    });

    // Sort by created_at to process in order
    const sortedTasks = tasks.sort((a, b) => {
      const dateA = a.created_at
        ? Date.parse(a.created_at)
        : 0;
      const dateB = b.created_at
        ? Date.parse(b.created_at)
        : 0;
      return dateA - dateB;
    });

    const lastTaskIdInt = lastTaskId
      ? parseInt(lastTaskId)
      : null;
    let newLastTaskId = lastTaskIdInt;
    const MAX_INITIAL_EVENTS = 8;

    // Track highest ID and filter to tasks newer than the stored ID
    let newTasks = sortedTasks.filter((task) => {
      const taskIdInt = parseInt(task.id);
      if (!newLastTaskId || taskIdInt > newLastTaskId) {
        newLastTaskId = taskIdInt;
      }
      return !lastTaskIdInt || taskIdInt > lastTaskIdInt;
    });

    // On first run, cap the initial backfill to the most recent tasks
    if (!lastTaskIdInt && newTasks.length > MAX_INITIAL_EVENTS) {
      newTasks = newTasks.slice(-MAX_INITIAL_EVENTS);
    }

    for (const task of newTasks) {
      this.$emit(task, this.generateMeta(task));
    }

    if (newLastTaskId) {
      this.db.set("lastTaskId", newLastTaskId);
    }
  },
};

