import estreamdesk from "../../estreamdesk.app.mjs";

export default {
  estreamdesk,
  key: "estreamdesk-new-ticket",
  name: "New Ticket",
  description: "Emit new event when a ticket is created",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    estreamdesk,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the eStreamDesk API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  hooks: {
    async activate() {
      const lastId = this._getLastId();
      await this.processTickets({
        lastId,
      },
        25);
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async processTickets(params, limit) {
      const tickets = this.estreamdesk.paginate({
        fn: this.estreamdesk.listTickets,
        params,
        limit,
      });
      let { lastId } = params;

      for await (const event of tickets) {
        if (!lastId || lastId <= event.Id) {
          this._setLastId(event.Id);
        }

        this.emitEvent(event);
        lastId = event.Id;
      }
    },
    emitEvent(event) {
      const ts = new Date();
      this.$emit(event, {
        id: `${event.Id}_${ts}`,
        ts,
        summary: `New ticket: ${event.Id}`,
      });
    },
  },
  async run() {
    const lastId = this._getLastId();
    const params = {};
    if (lastId) params.fromId = lastId;
    await this.processTickets(params);
  },
};
