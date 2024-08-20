import launchnotes from "../../launchnotes.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "launchnotes-new-subscription-created-instant",
  name: "New Subscription Created",
  description: "Emit new event when a new project subscription is created. [See the documentation](https://developer.launchnotes.com/index.html)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    launchnotes,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    projectId: {
      propDefinition: [
        launchnotes,
        "projectId",
      ],
    },
    subscriberId: {
      propDefinition: [
        launchnotes,
        "subscriberId",
      ],
    },
    subscriptionType: {
      propDefinition: [
        launchnotes,
        "subscriptionType",
        {
          optional: true,
        },
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit historical data events from the app, if applicable
    },
    async activate() {
      // Code to create a webhook subscription, if applicable
    },
    async deactivate() {
      // Code to delete the webhook subscription, if applicable
    },
  },
  async run(event) {
    const {
      projectId, subscriberId, subscriptionType,
    } = this;
    const response = await this.launchnotes.emitProjectSubscriptionCreatedEvent({
      projectId,
      subscriberId,
      subscriptionType,
    });

    this.$emit(response, {
      id: `${projectId}-${subscriberId}`,
      summary: `New subscription created for project ${projectId} by subscriber ${subscriberId}`,
      ts: Date.now(),
    });
  },
};
