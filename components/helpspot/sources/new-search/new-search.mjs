import { axios } from "@pipedream/platform";
import helpspot from "../../helpspot.app.mjs";

export default {
  key: "helpspot-new-search",
  name: "New Search Event",
  description: "Emit new event based on a search. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=163)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    helpspot,
    db: "$.service.db",
    searchQuery: {
      propDefinition: [
        helpspot,
        "searchQuery",
      ],
    },
    timer: {
      type: "$.interface.timer",
      label: "Poll Schedule",
      description: "Pipedream will poll the HelpSpot API on this schedule",
      default: {
        intervalSeconds: 3600,
      },
    },
  },
  methods: {
    _getLastSearchId() {
      return this.db.get("lastSearchId") || null;
    },
    _setLastSearchId(id) {
      this.db.set("lastSearchId", id);
    },
  },
  hooks: {
    async deploy() {
      const results = await this.helpspot.searchRequests({
        searchQuery: this.searchQuery,
      });
      const lastResult = results[results.length - 1];

      if (lastResult) {
        this._setLastSearchId(lastResult.xRequest);
      }

      for (const result of results.slice(0, 50)) {
        this.$emit(result, {
          id: result.xRequest,
          summary: `New request: ${result.sTitle || result.sFirstName || result.sLastName || result.tNote}`,
          ts: Date.parse(result.dtGMTOpened),
        });
      }
    },
  },
  async run() {
    const lastSearchId = this._getLastSearchId();
    const results = await this.helpspot.searchRequests({
      searchQuery: this.searchQuery,
    });

    for (const result of results) {
      if (!lastSearchId || result.xRequest > lastSearchId) {
        this.$emit(result, {
          id: result.xRequest,
          summary: `New request: ${result.sTitle || result.sFirstName || result.sLastName || result.tNote}`,
          ts: Date.parse(result.dtGMTOpened),
        });
      }
    }

    const newLastResult = results[results.length - 1];
    if (newLastResult) {
      this._setLastSearchId(newLastResult.xRequest);
    }
  },
};
