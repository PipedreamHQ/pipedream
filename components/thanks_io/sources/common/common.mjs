import thanksIo from "../../thanks_io.app.mjs";

export default {
  props: {
    thanksIo,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    subAccount: {
      propDefinition: [
        thanksIo,
        "subAccount",
      ],
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || null;
    },
    _setLastTimestamp(lastTimestamp) {
      this.db.set("lastTimestamp", lastTimestamp);
    },
    isLater(newDate, compareDate) {
      return compareDate
        ? (newDate > compareDate)
        : true;
    },
    async paginate(resourceFn, params, maxPages = 10) {
      let next, count = 0;
      const items = [];
      do {
        const {
          data, links,
        } = await resourceFn({
          url: next,
          params,
        });
        next = links?.next !== next
          ? links?.next
          : null;
        items.push(...data);
        count++;
      } while (next && count < maxPages);
      return items;
    },
  },
};
