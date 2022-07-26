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
    async paginate(resourceFn, params) {
      let next;
      const items = [];
      do {
        const {
          data, links,
        } = next
          ? await this._makeRequest({
            url: next,
            params,
          })
          : await resourceFn({
            params,
          });
        next = links?.next;
        items.push(...data);
      } while (next);
      return items;
    },
  },
};
