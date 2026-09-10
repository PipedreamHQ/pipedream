import docspring from "../../docspring.app.mjs";

export default {
  props: {
    docspring,
    db: "$.service.db",
    http: "$.interface.http",
    eventTypes: {
      propDefinition: [
        docspring,
        "eventTypes",
      ],
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Only receive live or test events. Leave blank for both.",
      options: [
        "live",
        "test",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhook = {
        url: this.http.endpoint,
        event_types: this.eventTypes,
        include_submission_data: true,
        version: 3,
        name: "Pipedream",
      };
      if (this.mode) {
        webhook.mode = this.mode;
      }
      const res = await this.docspring.createWebhook({ data: { webhook } });
      this.db.set("webhookUid", res.uid);
    },
    async deactivate() {
      const uid = this.db.get("webhookUid");
      if (uid) {
        try {
          await this.docspring.deleteWebhook({ uid });
        } catch (_e) {
          // A 404 (already deleted) is fine — deactivation must always succeed.
        }
      }
    },
  },
  methods: {
    // Flatten a v3 delivery: top-level `id` is the event uuid; the resource's own
    // id is exposed as `resource_id` (parity with the other DocSpring integrations).
    flatten(body) {
      const data = (body && body.data) || {};
      const resource = data.resource || {};
      const {
        id: resourceId, resource: _resource, ...rest
      } = data;
      return {
        id: body && body.id,
        event: body && body.event,
        timestamp: body && body.timestamp,
        resource_type: resource.type,
        resource_id: resourceId != null ? resourceId : resource.id,
        ...rest,
      };
    },
  },
  async run(event) {
    const body = (event && event.body) || {};
    const flattened = this.flatten(body);
    this.$emit(flattened, {
      id: body.id || `${Date.now()}`,
      summary: `${body.event || "event"}: ${flattened.resource_id || ""}`,
      ts: body.timestamp ? Date.parse(body.timestamp) : Date.now(),
    });
  },
};
