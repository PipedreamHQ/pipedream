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
    setLastEmittedDate(date) {
      this.db.set("lastEmittedDate", date);
    },
    getLastEmittedDate() {
      return this.db.get("lastEmittedDate");
    },
    getData() {
      throw new Error("getData() not implemented");
    },
    getParams() {
      return {
        sort: "created_at DESC",
      };
    },
    getAgregatorProp() {
      throw new Error("getAgregatorProp() not implemented");
    },
    getSummary() {
      throw new Error("getSummary() not implemented");
    },
  },
  async run() {
    const lastEmittedId = this.getLastEmmittedId();
    let page = 1;
    const emmitedEvents = [];

    const fetchDataMethod = this.getData();
    loop1:
    while (true) {
      const res = await fetchDataMethod(page, this.getParams());
      const events = res[this.getAgregatorProp()];
      if (events.length === 0) {
        break;
      }
      for (const event of events) {
        if (event.id === lastEmittedId) {
          break loop1;
        }
        emmitedEvents.unshift(event);
      }
      page++;
    }

    for (const event of emmitedEvents) {
      this.$emit(event, this.getSummary(event));
    }

    this.setLastEmittedDate(new Date());
    if (emmitedEvents.length > 0) {
      this.setLastEmmittedId(emmitedEvents[emmitedEvents.length - 1].id);
    }
  },
};
