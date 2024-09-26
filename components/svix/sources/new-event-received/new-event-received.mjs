import svix from "../../svix.app.mjs";

export default {
  key: "svix-new-event-received",
  name: "New Event Received (Instant)",
  description: "Emit new event when an event is received for an application",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    svix,
    http: "$.interface.http",
    db: "$.service.db",
    appId: {
      propDefinition: [
        svix,
        "appId",
      ],
    },
    eventTypes: {
      propDefinition: [
        svix,
        "eventTypes",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.svix.createEndpoint(this.appId, {
        data: {
          url: this.http.endpoint,
          version: "1",
          filterTypes: this.eventTypes,
        },
      });
      this._setEndpointId(id);
    },
    async deactivate() {
      const id = this._getEndpointId();
      await this.svix.deleteEndpoint(this.appId, id);
    },
  },
  methods: {
    _getEndpointId() {
      return this.db.get("endpointId");
    },
    _setEndpointId(id) {
      this.db.set("endpointId", id);
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: Date.now(),
      summary: "New event received",
      ts: Date.now(),
    });
  },
};
