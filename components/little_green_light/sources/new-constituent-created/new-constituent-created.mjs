import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import littleGreenLight from "../../little_green_light.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "little_green_light-new-constituent-created",
  name: "New Constituent Created",
  description: "Emit new event for each new constituent created in Little Green Light.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
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
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async generateMeta(constituent) {
      this.$emit(constituent, {
        id: constituent.id,
        summary: `New Constituent: ${constituent.first_name} ${constituent.last_name}`,
        ts: Date.parse(constituent.created_at),
      });
    },
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();

      let data = this.littleGreenLight.paginate({
        fn: this.littleGreenLight.searchConstituents,
      });

      let responseArray = [];
      for await (const item of data) {
        responseArray.push(item);
      }

      responseArray = responseArray.sort(
        (a, b) => b.id - a.id,
      );
      responseArray = responseArray.filter((item) => item.id > lastId);
      if (maxResults && (responseArray.length > maxResults)) responseArray.length = maxResults;
      if (responseArray.length) this._setLastId(responseArray[0].id);

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
  sampleEmit,
};
