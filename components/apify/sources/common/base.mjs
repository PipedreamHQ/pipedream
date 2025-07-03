import { WEBHOOK_EVENT_TYPES } from '@apify/consts';
import apify from "../../apify.app.mjs";

export default {
  props: {
    apify,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const response = await this.apify.createHook({
        data: {
          requestUrl: this.http.endpoint,
          eventTypes: [
            WEBHOOK_EVENT_TYPES.ACTOR_RUN_SUCCEEDED,
            WEBHOOK_EVENT_TYPES.ACTOR_RUN_FAILED,
            WEBHOOK_EVENT_TYPES.ACTOR_RUN_TIMED_OUT,
            WEBHOOK_EVENT_TYPES.ACTOR_RUN_ABORTED,
          ],
          condition: this.getCondition(),
        },
      });
      this.db.set("webhookId", response.data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.apify.deleteHook(webhookId);
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.$emit(body, {
      summary: body.eventType === WEBHOOK_EVENT_TYPES.TEST
        ? "Webhook test has successfully triggered!"
        : this.getSummary(body),
      id: body.eventData.actorRunId || `${body.userId}-${body.createAt}`,
      ts: Date.parse(body.createdAt),
    });
  },
};
