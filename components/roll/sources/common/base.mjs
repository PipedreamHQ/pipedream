import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import roll from "../../roll.app.mjs";

export default {
  ...roll,
  props: {
    roll,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Roll API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async processEvent(item) {
      this.$emit(item, this.getDataToEmit(item));
    },
    async startEvent({
      limit, paginate,
    }) {
      let offset = 0;
      let next = true;
      const items = [];
      let lastId = this._getLastId();
      const fieldId = this.getFieldId();
      do {
        const data = await this.roll.makeRequest({
          variables: {
            order: this.getOrderField(),
            limit,
            offset: paginate
              ? offset
              : 0,
          },
          query: this.getQuery(),
        });

        const dataArray = data[this.getFieldResponse()];

        if (!dataArray.length) next = false;

        for (const item of dataArray) {

          if (!lastId || item[fieldId] > lastId) {
            items.push(item);
          } else {
            next = false;
          }
        }
        offset += limit;
      } while (paginate && next);

      for (const item of items.reverse()) {
        this._setLastId(item[fieldId]);
        this.processEvent(item);
      }
    },
  },
  hooks: {
    async activate() {
      return await this.startEvent({
        limit: 20,
      });
    },
  },
  async run() {
    return await this.startEvent({
      limit: 50,
      paginate: true,
    });
  },
};

