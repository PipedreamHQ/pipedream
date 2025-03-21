import common from "../common/base.mjs";
import md5 from "md5";

export default {
  ...common,
  key: "splunk-new-search-event",
  name: "New Search Event",
  description: "Emit new event when a new search event is created. [See the documentation](https://docs.splunk.com/Documentation/Splunk/9.4.1/RESTREF/RESTsearch#search.2Fv2.2Fjobs.2F.7Bsearch_id.7D.2Fevents)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(event) {
      return {
        id: md5(JSON.stringify(event)),
        summary: "New Search Event",
        ts: Date.now(),
      };
    },
  },
  async run() {
    const jobIds = await this.getRecentJobIds();
    const events = [];
    for (const jobId of jobIds) {
      try {
        const response = await this.splunk.getSearchEvents({
          jobId,
        });
        if (response?.results?.length) {
          events.push(...response.results);
        }
      } catch {
        console.log(`No events found for sid: ${jobId}`);
      }
    }
    events.forEach((event) => {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    });
  },
};
