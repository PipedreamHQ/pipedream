import gist from "../../gist.app.mjs";

export default {
  ...gist,
  key: "gist-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    gist,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Gist API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  hooks: {
    async activate() {
      await this.processContacts({
        per_page: 25,
        order_by: "created_at",
        order: "desc",
      });
    },
  },
  methods: {
    _getCreatedAt() {
      return this.db.get("createdAt");
    },
    _setCreatedAt(createdAt) {
      this.db.set("createdAt", createdAt);
    },
    async processContacts(params) {
      const { contacts } = await this.gist.listContacts({
        params,
      });
      for (const contact of contacts) {
        this.emitEvent(contact);
      }
    },
    async processEvent() {
      const createdAt = this._getCreatedAt();
      await this.processContacts({
        per_page: 25,
        order_by: "created_at",
        order: "desc",
        created_at: createdAt,
      });
    },
    emitEvent(event) {
      const createdAt = this._getCreatedAt();

      if (!createdAt || (new Date(event.created_at) > new Date(createdAt)))
        this._setCreatedAt(event.created_at);

      const ts = Date.parse(event.created_at);
      this.$emit(event, {
        id: `${event.id}_${ts}`,
        ts,
        summary: `New contact created: ${event.full_name || event.email} (${event.id})`,
      });
    },
  },
  async run() {
    console.log("Run started:");
    return this.processEvent();
  },
};
