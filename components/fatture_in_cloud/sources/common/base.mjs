import { EVENT_TYPES_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import fattureInCloud from "../../fatture_in_cloud.app.mjs";

export default {
  props: {
    fattureInCloud,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    companyId: {
      propDefinition: [
        fattureInCloud,
        "companyId",
      ],
    },
    eventTypes: {
      propDefinition: [
        fattureInCloud,
        "eventTypes",
      ],
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.fattureInCloud.createWebhook({
        companyId: this.companyId,
        data: {
          data: {
            sink: this.http.endpoint,
            types: parseObject(this.eventTypes),
            config: {
              mapping: this.getContentMode(),
            },
          },
        },
      });
      this.db.set("webhookId", data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");

      await this.fattureInCloud.deleteWebhook({
        companyId: this.companyId,
        webhookId,
      });
    },
  },
  async run({ body }) {
    const eventName = EVENT_TYPES_OPTIONS.find((item) => item.value === body.type).label;

    this.$emit(body, {
      id: `${body.id}`,
      summary: `${this.getSummary()}: ${eventName}`,
      ts: Date.parse(body.time),
    });
  },
};
