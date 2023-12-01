import { axios } from "@pipedream/platform";
import userflow from "../../userflow.app.mjs";

export default {
  key: "userflow-new-checklist-completed-instant",
  name: "New Checklist Completed (Instant)",
  description: "Emits an event when a user has completed all tasks in a checklist. [See the documentation](https://userflow.com/docs/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    userflow,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    userId: {
      propDefinition: [
        userflow,
        "userId",
      ],
    },
    checklistId: {
      propDefinition: [
        userflow,
        "checklistId",
      ],
    },
    checklistTasks: {
      propDefinition: [
        userflow,
        "checklistTasks",
        (c) => ({
          checklistId: c.checklistId,
        }), // Assuming checklistTasks depends on checklistId
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Fetch the last 50 events and emit them
      const events = await this.userflow._makeRequest({
        path: "/events",
        params: {
          user_id: this.userId,
          checklist_id: this.checklistId,
          // Assuming a parameter exists to filter events related to checklist completion
        },
      });

      const lastEvents = events.slice(-50);
      for (const event of lastEvents.reverse()) {
        this.$emit(event, {
          id: event.id,
          summary: `User ${event.user_id} completed checklist ${event.checklist_id}`,
          ts: Date.parse(event.created_at),
        });
      }
    },
    async activate() {
      // TODO: Create a webhook subscription if supported by Userflow and save the ID
    },
    async deactivate() {
      // TODO: Delete the webhook subscription using the saved ID
    },
  },
  async run(event) {
    const { body } = event;

    // Validate the incoming webhook signature if applicable
    // This is a placeholder; the actual signature validation logic depends on the Userflow's method
    const computedSignature = "computed-signature";
    const signature = event.headers["Userflow-Signature"];
    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    // Emit the event if it's related to checklist completion
    if (body.data.object.id === this.checklistId && body.topic === "checklist.completed") {
      this.$emit(body, {
        id: body.id,
        summary: `User ${body.data.user_id} completed checklist ${this.checklistId}`,
        ts: Date.parse(body.created_at),
      });
    }

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "Webhook received",
    });
  },
};
