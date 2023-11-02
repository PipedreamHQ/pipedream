import { axios } from "@pipedream/platform";
import browse_ai from "../../browse_ai.app.mjs";

export default {
  key: "browse_ai-task-completed",
  name: "Task Completed",
  description: "Emits an event when a Browse AI task status changes to successful.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    browse_ai: {
      type: "app",
      app: "browse_ai",
    },
    robotId: {
      propDefinition: [
        browse_ai,
        "robotId",
      ],
    },
    inputParameters: {
      propDefinition: [
        browse_ai,
        "inputParameters",
      ],
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.browse_ai.runRobot({
        robotId: this.robotId,
        inputParameters: this.inputParameters,
      });
      this.db.set("taskId", id);
    },
  },
  async run(event) {
    const taskId = this.db.get("taskId");
    const { status } = await this.browse_ai.getTaskStatus({
      taskId,
    });

    if (status === "successful") {
      this.$emit({
        taskId,
        status,
      }, {
        id: taskId,
        summary: `Task ${taskId} completed successfully`,
        ts: Date.now(),
      });
    }
  },
};
