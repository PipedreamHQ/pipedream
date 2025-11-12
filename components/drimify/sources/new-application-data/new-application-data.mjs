import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import drimify from "../../drimify.app.mjs";

export default {
  key: "drimify-new-application-data",
  name: "New Application Data Collected",
  description: "Emit new event when application data has been collected. [See the documentation](https://endpoint.drimify.com/api/docs?ui=re_doc#tag/AppDataCollection/operation/api_app_data_collections_get_collection)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    drimify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    applicationId: {
      propDefinition: [
        drimify,
        "applicationId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.drimify.paginate({
        fn: this.drimify.listAppDataCollections,
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.date) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0].date);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.idunic || item.id,
          summary: `New Data Collected with ID: ${item.id}`,
          ts: Date.parse(item.date),
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
};
