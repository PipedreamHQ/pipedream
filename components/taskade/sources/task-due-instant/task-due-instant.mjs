import taskade from "../../taskade.app.mjs";

export default {
  key: "taskade-task-due-instant",
  name: "Task Due Instant",
  description: "Emit new event when a task's due date is reached",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    taskade,
    task_id: {
      propDefinition: [
        taskade,
        "task_id",
      ],
    },
    assignee_id: {
      propDefinition: [
        taskade,
        "assignee_id",
      ],
      optional: true,
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const task = await this.taskade.getTask(this.task_id);
      if (!task.item[0].dueDate) {
        console.log("This task does not have a due date");
        return;
      }
      const dueDate = new Date(task.item[0].dueDate.start.date);
      if (dueDate < new Date()) {
        console.log("The due date for this task has already passed");
        return;
      }
      this.db.set("dueDate", dueDate.getTime());
    },
    async activate() {
      const intervalId = setInterval(() => {
        const dueDate = new Date(this.db.get("dueDate"));
        if (dueDate <= new Date()) {
          clearInterval(intervalId);
          this.$emit(
            {
              task_id: this.task_id,
            },
            {
              id: this.task_id,
              summary: `Task ${this.task_id} due date reached`,
              ts: Date.now(),
            },
          );
        }
      }, 60 * 1000); // check every minute
      this.db.set("intervalId", intervalId);
    },
    async deactivate() {
      clearInterval(this.db.get("intervalId"));
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });
  },
};
