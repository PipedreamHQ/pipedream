import helpspot from "../../helpspot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "helpspot-new-request",
  name: "New Request Created",
  description: "Emit new event when a new request is created. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=163)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    helpspot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastRequestId() {
      return this.db.get("lastRequestId") || null;
    },
    _setLastRequestId(id) {
      this.db.set("lastRequestId", id);
    },
    async emitNewRequests() {
      const lastRequestId = this._getLastRequestId();
      const searchQuery = lastRequestId
        ? `xRequest>${lastRequestId}`
        : "Date_Created:[* TO NOW]";

      const newRequests = await this.helpspot.searchRequests({
        searchQuery,
      });

      for (const request of newRequests) {
        this.$emit(request, {
          id: request.xRequest,
          summary: `New Request: ${request.xRequest}`,
          ts: Date.parse(request.dtGMTOpened),
        });
      }

      if (newRequests.length) {
        this._setLastRequestId(newRequests[newRequests.length - 1].xRequest);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitNewRequests();
    },
    async activate() {
      await this.emitNewRequests();
    },
    async deactivate() {
      // Clean up any resources if needed
    },
  },
  async run() {
    await this.emitNewRequests();
  },
};
