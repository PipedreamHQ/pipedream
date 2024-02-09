import qualetics from "../../qualetics.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "source",
  key: "qualetics-new-search",
  name: "New Search Event",
  description: "Emits an event each time a new search is performed in the web app",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  props: {
    qualetics,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    searchTerms: {
      propDefinition: [
        qualetics,
        "searchTerms",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Get most recent search results
      const searchResults = await this.qualetics.searchWebApp(this.searchTerms);
      if (searchResults.length > 0) {
        this.db.set("lastSearchResultId", searchResults[0]._id);
      }
    },
  },
  async run() {
    // Fetch new search results
    const searchResults = await this.qualetics.searchWebApp(this.searchTerms);
    const lastSearchResultId = this.db.get("lastSearchResultId");

    // Emit new search results
    for (const searchResult of searchResults) {
      if (searchResult._id === lastSearchResultId) {
        break;
      }
      this.$emit(searchResult, {
        id: searchResult._id,
        summary: `New search result: ${searchResult.title}`,
        ts: Date.parse(searchResult.created),
      });
    }

    // Store ID of the most recent search result
    if (searchResults.length > 0) {
      this.db.set("lastSearchResultId", searchResults[0]._id);
    }
  },
};
