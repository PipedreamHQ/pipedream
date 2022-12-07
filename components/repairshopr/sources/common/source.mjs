import app from "../../repairshopr.app.mjs";

export default {
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    db: "$.service.db",
  },
  methods: {
    setLastEmmittedId(id) {
      this.db.set("lastEmittedId", id);
    },
    getLastEmmittedId() {
      return this.db.get("lastEmittedId");
    },
    getData() {
      throw new Error("getData() not implemented");
    },
    getParams() {
      return {
        sort: "created_at DESC",
      };
    },
  },
  async run() {
    const lastEmittedId = this.getLastEmmittedId();
    let page = 1;
    const events = [];

    const fetchDataMethod = this.getData();
    loop1:
    while (true) {
      const { customers } = await fetchDataMethod(page, this.getParams());
      if (customers.length === 0) {
        break;
      }
      for (const customer of customers) {
        if (customer.id === lastEmittedId) {
          break loop1;
        }
        events.unshift(customer);
      }
      page++;
    }

    for (const event of events) {
      this.$emit(event, {
        id: event.id,
        summary: event.business_name || event.email || event.id,
        ts: event.created_at || Date.now(),
      });
    }

    if (events.length > 0) {
      this.setLastEmmittedId(events[events.length - 1].id);
    }
  },
};
