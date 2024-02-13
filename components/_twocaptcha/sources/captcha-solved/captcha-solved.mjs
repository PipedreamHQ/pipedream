import { axios } from "@pipedream/platform";
import _twocaptcha from "../../_twocaptcha.app.mjs";

export default {
  key: "_twocaptcha-captcha-solved",
  name: "Captcha Solved",
  description: "Emit new event when a captcha has been successfully solved by the 2Captcha service.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    _twocaptcha,
    db: "$.service.db",
    clientKey: {
      propDefinition: [
        _twocaptcha,
        "clientKey",
      ],
    },
  },
  methods: {
    async checkTaskCompletion(clientKey, taskId) {
      const response = await this._twocaptcha.getTaskResult({
        clientKey,
        taskId,
      });

      return response.status === "ready";
    },
  },
  hooks: {
    async deploy() {
      const lastTaskId = this.db.get("lastTaskId") || "0";
      const taskId = this.db.get("submittedTaskId");

      if (!taskId) {
        console.log("No new captcha tasks submitted for solving.");
        return;
      }

      if (taskId > lastTaskId) {
        const isCompleted = await this.checkTaskCompletion(this.clientKey, taskId);

        if (isCompleted) {
          const taskResult = await this._twocaptcha.getTaskResult({
            clientKey: this.clientKey,
            taskId: taskId,
          });
          this.$emit(taskResult, {
            id: taskResult.taskId,
            summary: `Captcha Solved: ${taskResult.taskId}`,
            ts: Date.now(),
          });

          this.db.set("lastTaskId", taskId);
        } else {
          console.log(`Task ${taskId} is still being processed or encountered an error.`);
        }
      }
    },
  },
  async run() {
    const lastTaskId = this.db.get("lastTaskId") || "0";
    const taskId = this.db.get("submittedTaskId");

    if (!taskId) {
      console.log("No new captcha tasks submitted for solving.");
      return;
    }

    if (taskId > lastTaskId) {
      const isCompleted = await this.checkTaskCompletion(this.clientKey, taskId);

      if (isCompleted) {
        const taskResult = await this._twocaptcha.getTaskResult({
          clientKey: this.clientKey,
          taskId: taskId,
        });
        this.$emit(taskResult, {
          id: taskResult.taskId,
          summary: `Captcha Solved: ${taskResult.taskId}`,
          ts: Date.now(),
        });

        this.db.set("lastTaskId", taskId);
      } else {
        console.log(`Task ${taskId} is still being processed or encountered an error.`);
      }
    }
  },
};
