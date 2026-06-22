import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import nutshell from "../../nutshell.app.mjs";

export default {
  props: {
    nutshell,
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
    /**
     * Resolve a createdTime value that may be a REST object {timestamp, value}
     * or a plain ISO string (JSON-RPC shape).
     */
    _getTs(item) {
      const ct = item.createdTime;
      if (ct && typeof ct === "object") {
        return (ct.timestamp ?? Date.parse(ct.value)) || Date.now();
      }
      return ct
        ? Date.parse(ct) || Date.now()
        : Date.now();
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: this._getTs(item),
      };
    },
    /**
     * REST endpoint path for this source. Child classes must implement.
     */
    getPath() {
      throw new Error("getPath() must be implemented by the child source");
    },
    /**
     * Top-level response key holding the items array (e.g. "leads", "contacts").
     * Child classes must implement.
     */
    getEntityKey() {
      throw new Error("getEntityKey() must be implemented by the child source");
    },
    /**
     * Extra REST query params (e.g. { status: "won" }).
     * Child classes may override.
     */
    getParams() {
      return {
        sort: "-id",
      };
    },
    async prepareData({
      lastData, maxResults,
    }) {
      let responseArray = [];
      for await (const item of this.nutshell.paginate({
        path: this.getPath(),
        entityKey: this.getEntityKey(),
        params: this.getParams(),
      })) {
        if (item.id === lastData) break;
        responseArray.push(item);
      }
      if (responseArray.length) {
        this._setLastData(responseArray[0].id);
      }
      if (maxResults && responseArray.length > maxResults) {
        responseArray.length = maxResults;
      }
      return responseArray;
    },
    async startEvent(maxResults = 0) {
      const lastData = this._getLastData();
      const responseArray = await this.prepareData({
        lastData,
        maxResults,
      });
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
