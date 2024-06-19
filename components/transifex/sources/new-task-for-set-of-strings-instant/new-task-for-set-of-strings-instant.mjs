import transifex from "../../transifex.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "transifex-new-task-for-set-of-strings-instant",
  name: "New Task for Set of Strings Instant",
  description: "Emit new event when the strings of a task are selected or fully translated. [See the documentation](https://developers.transifex.com/reference/post_project-webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    transifex: {
      type: "app",
      app: "transifex",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    taskId: {
      propDefinition: [
        transifex,
        "taskId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.transifex.emitTaskStringEvent({
        taskId: this.taskId,
      });
    },
    async activate() {
      const webhookId = await this.transifex.createTaskWebhook({
        taskId: this.taskId,
        url: this.http.endpoint,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.transifex.deleteTaskWebhook({
          webhookId,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const { taskId } = event.body;
    await this.transifex.emitTaskStringEvent({
      taskId,
    });
  },
};
