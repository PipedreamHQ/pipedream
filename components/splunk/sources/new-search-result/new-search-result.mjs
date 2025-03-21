import common from "../common/base.mjs";

export default {
  ...common,
  key: "splunk-new-search-result",
  name: "New Search Result",
  description: "Emit new events when a search returns results in Splunk. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#saved.2Fsearches)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(result) {
      return {
        id: result.sid,
        summary: `New Search Results with SID: ${result.sid}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const jobIds = await this.getRecentJobIds();
    const searchResults = [];
    for (const jobId of jobIds) {
      try {
        const response = await this.splunk.getSearchResults({
          jobId,
        });
        if (response?.results?.length) {
          searchResults.push(...response.results);
        }
      } catch {
        console.log(`No results found for sid: ${jobId}`);
      }
    }
    searchResults.forEach((result) => {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    });
  },
};
