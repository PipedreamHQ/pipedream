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
      return {
        id: task.id,
        summary: `New task created: ${task.name || task.id}`,
        ts: Date.parse(task.created_at || new Date()),
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
      const dateA = Date.parse(a.created_at || 0);
      const dateB = Date.parse(b.created_at || 0);
      return dateA - dateB;
    });

    const lastTaskIdInt = lastTaskId
      ? parseInt(lastTaskId)
      : null;
    let newLastTaskId = lastTaskIdInt;
    let foundLastTask = !lastTaskIdInt;
    const MAX_INITIAL_EVENTS = 8;
    let initialEventsEmitted = 0;
    let shouldStopEmitting = false;

    for (const task of sortedTasks) {
      const taskIdInt = parseInt(task.id);

      // Always track the highest task ID we've seen
      if (!newLastTaskId || taskIdInt > newLastTaskId) {
        newLastTaskId = taskIdInt;
      }

      if (!lastTaskIdInt) {
        // First run - emit up to MAX_INITIAL_EVENTS tasks
        if (!shouldStopEmitting) {
          this.$emit(task, this.generateMeta(task));
          initialEventsEmitted++;
          if (initialEventsEmitted >= MAX_INITIAL_EVENTS) {
            shouldStopEmitting = true;
          }
        }
        // Continue iterating to track highest task ID even after cap
      } else if (taskIdInt === lastTaskIdInt) {
        // Found the last task we processed, mark that we should start emitting new ones
        foundLastTask = true;
      } else if (foundLastTask) {
        // We've passed the last task, emit all new tasks
        this.$emit(task, this.generateMeta(task));
      }
      // If still looking for last task, we just track the highest ID (already done above)
    }

    if (newLastTaskId) {
      this.db.set("lastTaskId", newLastTaskId);
    }
  },
};

