import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import agrello from "../../agrello.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "agrello-new-document",
  name: "New Document Added to Folder",
  description: "Emit new event when a user adds a document to a specific folder. [See the documentation](https://api.agrello.io/public/webjars/swagger-ui/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    agrello,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    folderId: {
      propDefinition: [
        agrello,
        "folderId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.agrello.paginate({
        fn: this.agrello.listDocuments,
        folderId: this.folderId,
        params: {
          sort: "createdAt,DESC",
        },
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.createdAt) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(Date.parse(responseArray[0].createdAt));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New Document: ${item.name}`,
          ts: Date.parse(item.createdAt),
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
