import videoask from "../../videoask.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    videoask,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    organizationId: {
      propDefinition: [
        videoask,
        "organizationId",
      ],
    },
    formId: {
      propDefinition: [
        videoask,
        "formId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "A unique identifier for the webhook",
    },
  },
  hooks: {
    async activate() {
      await this.videoask.createWebhook({
        formId: this.formId,
        tag: this.tag,
        data: {
          url: this.http.endpoint,
          event_types: this.getEventTypes(),
        },
      });
    },
    async deactivate() {
      await this.videoask.deleteWebhook({
        formId: this.formId,
        tag: this.tag,
      });
    },
  },
  methods: {
    getEventTypes() {
      throw new ConfigurationError("getEventTypes is not implemented");
    },
    generateMeta(body) {
      return {
        id: body.event_id,
        summary: `New ${body.event_type} event`,
        ts: Date.now(),
      };
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    if (!body) {
      return;
    }

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
