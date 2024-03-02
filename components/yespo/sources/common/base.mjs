import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import yespo from "../../yespo.app.mjs";

export default {
  props: {
    yespo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    generateMeta(contact) {
      return {
        id: contact.id,
        summary: `New Contact: ${contact.firstName} ${contact.lastName}`,
        ts: Date.now(),
      };
    },
    getData() {
      return {};
    },
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();

      let data = this.yespo.paginate({
        fn: this.getFn(),
        ...this.getData(),
        maxResults,
      });

      const responseArray = [];

      for await (const item of data) {
        responseArray.push(item);
      }
      responseArray.filter((item) => item.id > lastId);
      if (responseArray.length) this._setLastId(responseArray[0].id);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
