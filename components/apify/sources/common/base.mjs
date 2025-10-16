import {
  WEBHOOK_EVENT_TYPE_GROUPS, WEBHOOK_EVENT_TYPES,
} from "@apify/consts";
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
        requestUrl: this.http.endpoint,
        eventTypes: WEBHOOK_EVENT_TYPE_GROUPS.ACTOR_RUN_TERMINAL,
        condition: this.getCondition(),
      });
      this.db.set("webhookId", response.id);
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
