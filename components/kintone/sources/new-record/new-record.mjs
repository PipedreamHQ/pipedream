import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import kintone from "../../kintone.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "kintone-new-record",
  name: "New Record",
  description: "Emit new event when a new record is added to a Kintone App. [See the documentation](https://kintone.dev/en/docs/kintone/rest-api/records/get-records/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    kintone,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    appId: {
      propDefinition: [
        kintone,
        "appId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00Z";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const query = `Created_datetime > "${lastDate}" order by Created_datetime desc`;

      const response = this.kintone.paginate({
        fn: this.kintone.getRecords,
        maxResults,
        query,
        params: {
          app: this.appId,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0].Created_datetime.value);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.$id.value,
          summary: `New record with ID: ${item.$id.value}`,
          ts: Date.parse(item.Created_datetime.value),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
