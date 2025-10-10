import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import bitport from "../../bitport.app.mjs";
import { prepareList } from "../../common/utils.mjs";

export default {
  props: {
    bitport,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    folderCode: {
      propDefinition: [
        bitport,
        "folderCode",
      ],
      withLabel: true,
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getFilter() {
      return false;
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const bufferObj = Buffer.from(this.folderCode.label, "utf8");
      const base64String = bufferObj.toString("base64");

      const { data: response } = await this.bitport.listFolders({
        maxResults,
        params: {
          folderPath: base64String,
        },
      });

      let items = prepareList({
        items: response,
        filesOnly: true,
      });

      if (items.length) {
        items = items.filter((item) => {
          return Date.parse(item.created_at.date) > lastDate;
        })
          .sort((a, b) => Date.parse(b.created_at.date) - Date.parse(a.created_at.date));

        const filteredItems = this.getFilter(items);
        if (filteredItems) {
          items = filteredItems;
        }
        if (items.length) {
          if (maxResults && (items.length > maxResults)) {
            items.length = maxResults;
          }
          this._setLastDate(Date.parse(items[0].created_at.date));
        }
      }

      for (const item of items.reverse()) {
        this.$emit(item, {
          id: item.code,
          summary: this.getSummary(item),
          ts: Date.parse(item.created_at.date),
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
