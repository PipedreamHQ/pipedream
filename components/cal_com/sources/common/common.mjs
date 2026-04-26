import calCom from "../../cal_com.app.mjs";

export default {
  props: {
    calCom,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const response = await this.calCom.listBookings();
      const bookings = response?.data ?? [];
      if (!bookings.length) {
        return;
      }
      await this.emitHistoricalEvents(bookings);
    },
    async activate() {
      const data = {
        triggers: this.eventTriggers(),
        subscriberUrl: this.http.endpoint,
        active: true,
      };
      const response = await this.calCom.createWebhook(data);
      this._setHookId(response?.data?.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      await this.calCom.deleteWebhook(hookId);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    emitHistoricalEvents() {
      throw new Error("getHistoricalEvents is not implemented");
    },
    eventTriggers() {
      throw new Error("eventTriggers is not implemented");
    },
    generateMeta(payload, ts) {
      return {
        id: payload.uid,
        summary: payload.title,
        ts,
      };
    },
  },
  async run(event) {
    const {
      body: {
        payload, createdAt,
      },
    } = event;
    const meta = this.generateMeta(payload, Date.parse(createdAt));
    this.$emit(payload, meta);
  },
};
