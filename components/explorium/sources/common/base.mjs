import explorium from "../../explorium.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    explorium,
    http: "$.interface.http",
    partnerId: {
      type: "string",
      label: "Partner ID",
      description: "The ID of the partner to use for webhooks",
    },
    enrollmentKey: {
      type: "string",
      label: "Enrollment Key",
      description: "A custom identifier you provide to categorize this set of enrollments",
    },
  },
  hooks: {
    async activate() {
      await this.explorium.createWebhook({
        data: {
          partner_id: this.partnerId,
          webhook_url: this.http.endpoint,
        },
      });
      const data = {
        enrollment_key: this.enrollmentKey,
        event_types: this.eventTypes,
      };
      if (this.businessIds) {
        await this.explorium.enrollBusinesses({
          data: {
            ...data,
            business_ids: this.businessIds,
          },
        });
      } else if (this.prospectIds) {
        await this.explorium.enrollProspects({
          data: {
            ...data,
            prospect_ids: this.prospectIds,
          },
        });
      }
    },
    async deactivate() {
      await this.explorium.deleteWebhook({
        partnerId: this.partnerId,
      });
    },
  },
  methods: {
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
    },
  },
  async run({ body }) {
    if (!body) {
      return;
    }
    const meta = this.generateMeta(body);
    this.emitEvent(body, meta);
  },
};
