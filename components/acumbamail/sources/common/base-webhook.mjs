import acumbamail from "../../acumbamail.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { EVENT_TYPES } from "./eventTypes.mjs";

export default {
  props: {
    acumbamail,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    listId: {
      propDefinition: [
        acumbamail,
        "listId",
      ],
    },
  },
  hooks: {
    async activate() {
      const eventTypes = EVENT_TYPES;
      eventTypes[this.getEventType()] = true;
      await this.acumbamail.configureWebhook({
        data: {
          list_id: this.listId,
          callback_url: this.http.endpoint,
          active: true,
          ...eventTypes,
        },
      });
    },
    async deactivate() {
      await this.acumbamail.configureWebhook({
        data: {
          list_id: this.listId,
          callback_url: this.http.endpoint,
          active: false,
        },
      });
    },
  },
  methods: {
    getEventType() {
      throw new ConfigurationError("getEventType is not implemented");
    },
    generateMeta(event) {
      return {
        id: event.timestamp,
        summary: `New ${event.event} event`,
        ts: event.timestamp,
      };
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    if (!body) return;

    if (Array.isArray(body)) {
      for (const event of body) {
        this.$emit(event, this.generateMeta(event));
      }
    } else {
      this.$emit(body, this.generateMeta(body));
    }
  },
};
