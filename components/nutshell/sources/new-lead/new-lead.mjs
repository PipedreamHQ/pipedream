import common from "../common/base.mjs";
import {
  ENDPOINTS, ENTITY_KEYS,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nutshell-new-lead",
  name: "New Lead",
  description: "Emit new event when a new lead is created. [See the documentation](https://developers.nutshell.com/reference/132e65861bebcb3781c3d37e66aff309)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getPath() {
      return ENDPOINTS.LEADS;
    },
    getEntityKey() {
      return ENTITY_KEYS.LEADS;
    },
    getSummary(item) {
      const name = typeof item.name === "object"
        ? (item.name?.displayName ?? item.name?.givenName ?? item.id)
        : (item.name || item.id);
      return `New Lead: ${name}`;
    },
    /**
     * Resolve createdTime which may be a REST object {timestamp, value} or ISO
     * string. Returns 0 when absent so the item sorts/filters as oldest.
     */
    _getCreatedTs(item) {
      const ct = item.createdTime;
      if (!ct) {
        return 0;
      }
      if (typeof ct === "object") {
        return (ct.timestamp ?? Date.parse(ct.value)) || 0;
      }
      return Date.parse(ct) || 0;
    },
    async prepareData({
      lastData, maxResults,
    }) {
      let responseArray = [];
      for await (const item of this.nutshell.paginate({
        $: this,
        path: this.getPath(),
        entityKey: this.getEntityKey(),
        params: this.getParams(),
      })) {
        responseArray.push(item);
      }

      // Filter + sort by createdTime client-side.
      // lastData is the last createdTime emitted (0 when never run).
      const lastTs = Number(lastData) || 0;
      responseArray = responseArray
        .filter((item) => this._getCreatedTs(item) > lastTs)
        .sort((a, b) => this._getCreatedTs(b) - this._getCreatedTs(a));

      if (responseArray.length) {
        this._setLastData(this._getCreatedTs(responseArray[0]));
      }
      if (maxResults && responseArray.length > maxResults) {
        responseArray.length = maxResults;
      }
      return responseArray;
    },
  },
  sampleEmit,
};
