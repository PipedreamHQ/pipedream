import common from "../common/base.mjs";
import {
  ENDPOINTS, ENTITY_KEYS, LEAD_WON_STATUS,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nutshell-lead-won",
  name: "New Lead Won",
  description: "Emit new event when a lead is won. [See the documentation](https://developers.nutshell.com/reference/132e65861bebcb3781c3d37e66aff309)",
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
    getParams() {
      return {
        sort: "-closedTime",
      };
    },
    getSummary(item) {
      const name = typeof item.name === "object"
        ? (item.name?.displayName ?? item.name?.givenName ?? item.id)
        : (item.name || item.id);
      return `New Lead Won: ${name}`;
    },
    /**
     * Resolve closedTime which may be a REST object {timestamp, value} or ISO string.
     */
    _getClosedTs(item) {
      const ct = item.closedTime;
      if (!ct) return 0;
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

      // lastData is the last closedTime stored (0 when never run).
      // closedTime alone also matches *lost* leads, so guard on status here.
      const lastTs = Number(lastData) || 0;
      responseArray = responseArray
        .filter((item) => item.status === LEAD_WON_STATUS && this._getClosedTs(item) > lastTs)
        .sort((a, b) => this._getClosedTs(b) - this._getClosedTs(a));

      if (responseArray.length) {
        this._setLastData(this._getClosedTs(responseArray[0]));
      }
      if (maxResults && responseArray.length > maxResults) {
        responseArray.length = maxResults;
      }
      return responseArray;
    },
  },
  sampleEmit,
};
