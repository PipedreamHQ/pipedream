import updown from "../../updown_io.app.mjs";

export default {
  props: {
    updown,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.updown.createRecipient({
        data: {
          type: "webhook",
          value: this.http.endpoint,
        },
      });
      this._setRecipientId(id);
    },
    async deactivate() {
      const recipientId = this._getRecipientId();
      if (recipientId) {
        await this.updown.deleteRecipient({
          recipientId,
        });
      }
    },
  },
  methods: {
    _getRecipientId() {
      return this.db.get("recipientId");
    },
    _setRecipientId(recipientId) {
      this.db.set("recipientId", recipientId);
    },
    getEventTypes() {
      return false;
    },
    isRelevant() {
      return true;
    },
    generateMeta(event) {
      const ts = Date.parse(event.time);
      return {
        id: `${event.event}${ts}`,
        summary: event.description,
        ts,
      };
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });
    const eventTypes = this.getEventTypes();
    for (const event of body) {
      if ((!eventTypes?.length || eventTypes.includes(event.event)) && this.isRelevant(event)) {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    }
  },
};
