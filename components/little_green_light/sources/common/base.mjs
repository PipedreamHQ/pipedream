import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import littleGreenLight from "../../little_green_light.app.mjs";

export default {
  props: {
    littleGreenLight,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastData() {
      return this.db.get("lastData") || 0;
    },
    _setLastData(lastData) {
      this.db.set("lastData", lastData);
    },
    async generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(),
        ts: Date.parse(item.created_at),
      };
    },
    getOpts() {
      return {
        fn: this.getFn(),
      };
    },
    async startEvent(maxResults = 0) {
      const lastData = this._getLastData();

      let data = this.littleGreenLight.paginate(this.getOpts(maxResults, lastData));

      const responseArray = await this.prepareDate(data, lastData, maxResults);

      for (const item of responseArray.reverse()) {
        this.$emit(item, await this.generateMeta(item));
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
