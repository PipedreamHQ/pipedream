import everhour from "../../everhour.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "everhour-task-time-updated-instant",
  name: "Task Time Updated",
  description: "Emit new event when a task's time spent is modified in Everhour. [See the documentation](https://everhour.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    everhour,
    db: "$.service.db",
    projectId: {
      propDefinition: [
        everhour,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.everhour.emitTimeUpdatedEvent(this.projectId);
    },
    async activate() {
      await this.everhour.emitTimeUpdatedEvent(this.projectId);
    },
    async deactivate() {
      // Currently, Everhour API does not provide an endpoint to delete a webhook.
      // If such an API becomes available, you should implement it here.
    },
  },
  async run() {
    const events = await axios(this, {
      method: "GET",
      url: `${this.everhour._baseUrl()}/projects/${this.projectId}/time-record-events`,
      headers: {
        "Authorization": `Bearer ${this.everhour.$auth.api_key}`,
      },
    });

    for (const event of events) {
      this.$emit(event, {
        id: event.id.toString(),
        summary: `Task Time Updated: ${event.id}`,
        ts: new Date(event.spentAt).getTime(),
      });
    }
  },
};
