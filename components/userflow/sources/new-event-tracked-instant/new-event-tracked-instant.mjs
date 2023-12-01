import userflow from "../../userflow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "userflow-new-event-tracked-instant",
  name: "New Event Tracked (Instant)",
  description: "Emits a new event when an event is tracked in Userflow. [See the documentation](https://userflow.com/docs/api)",
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
    eventName: {
      propDefinition: [
        userflow,
        "eventName",
      ],
    },
    eventProperties: {
      type: "object",
      label: "Event Properties",
      description: "Properties of the event being tracked.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // No historical events to fetch on deploy
    },
    async activate() {
      // No webhook to activate since Userflow webhooks are managed outside of Pipedream
    },
    async deactivate() {
      // No webhook to deactivate since Userflow webhooks are managed outside of Pipedream
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    const signature = headers["Userflow-Signature"];

    // Optionally, you can verify the signature here

    if (body.object === "event" && body.data.object.user_id === this.userId && body.data.object.name === this.eventName) {
      const eventData = {
        id: body.data.object.id,
        ...body.data.object,
      };

      this.$emit(eventData, {
        id: eventData.id,
        summary: `Tracked event: ${eventData.name}`,
        ts: Date.parse(eventData.created_at),
      });
    } else {
      this.http.respond({
        status: 200,
        body: "Ignored non-event object",
      });
    }
  },
};
