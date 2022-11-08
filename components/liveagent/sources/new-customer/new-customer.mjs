import liveagent from "../../liveagent.app.mjs";

export default {
  name: "New Customer",
  version: "0.0.2",
  key: "liveagent-new-customer",
  description: "Emit new event on each new customer.",
  type: "source",
  dedupe: "unique",
  props: {
    liveagent,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New customer with id ${data.id}`,
        ts: Date.parse(data.date_created),
      });
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
  },
  hooks: {
    async deploy() {
      const customers = await this.liveagent.getCustomers({
        params: {
          _perPage: 20,
          _sortDir: "DESC",
          _sortField: "date_created",
        },
      });

      if (customers.length) {
        this._setLastTimestamp(Date.parse(customers[0].date_created));
      }

      customers.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    this._setLastTimestamp(new Date().getTime());

    let page = 1;

    while (true) {
      const customers = await this.liveagent.getCustomers({
        params: {
          _page: page,
          _perPage: 100,
          _sortDir: "DESC",
          _sortField: "date_created",
        },
      });

      customers.reverse().forEach(this.emitEvent);

      if (customers.length < 100 || Date.parse(customers[0].date_created) < +lastTimestamp) {
        return;
      }

      if (customers.length) {
        this._setLastTimestamp(Date.parse(customers[0].date_created));
      }

      page++;
    }

  },
};
