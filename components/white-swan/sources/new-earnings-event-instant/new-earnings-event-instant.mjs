import whiteSwan from "../../white-swan.app.mjs";

export default {
  key: "white-swan-new-earnings-event-instant",
  name: "New Earnings Event Instant",
  description: "Emits a new event when a new earnings event is created for your account, such as credits from client referrals or partner payouts.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    whiteSwan,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getEarningsEventsLastSeenId() {
      return this.db.get("earningsEventsLastSeenId");
    },
    _setEarningsEventsLastSeenId(id) {
      this.db.set("earningsEventsLastSeenId", id);
    },
  },
  hooks: {
    async deploy() {
      const { data } = await this.whiteSwan.emitEarningsEvent();
      if (data && data.length > 0) {
        const [
          { id },
        ] = data;
        this._setEarningsEventsLastSeenId(id);
      }
    },
  },
  async run() {
    const lastSeenId = this._getEarningsEventsLastSeenId();
    const { data } = await this.whiteSwan.emitEarningsEvent();
    if (data && data.length > 0) {
      data.forEach((event) => {
        if (lastSeenId < event.id) {
          this.$emit(event, {
            id: event.id,
            summary: `New Earnings Event: ${event.id}`,
            ts: Date.now(),
          });
          this._setEarningsEventsLastSeenId(event.id);
        }
      });
    }
  },
};
