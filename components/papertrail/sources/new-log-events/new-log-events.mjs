import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "papertrail-new-log-events",
  name: "New Log Events",
  description: "Emit new log lines by polling the Papertrail search API (live-tail style using `min_id`). Optional search query, system, or group scope. [See the documentation](https://www.papertrail.com/help/search-api/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    q: {
      type: "string",
      label: "Search Query",
      description: "Optional Papertrail search query to filter events",
      optional: true,
    },
    systemId: {
      propDefinition: [
        common.props.papertrail,
        "systemId",
      ],
      optional: true,
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "Optional numeric group ID to limit events",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New log event: ${item.id}`;
    },
    async prepareResults(lastData, maxResults) {
      let { events } = await this.papertrail.searchEvents({
        params: {
          q: this.q,
          system_id: this.systemId,
          group_id: this.groupId,
        },
      });
      events = events
        .filter((item) => item.id > lastData)
        .sort((a, b) => b.id - a.id);

      if (events.length) {
        if (maxResults && (events.length > maxResults)) {
          events.length = maxResults;
        }
      }
      return events.reverse();
    },
  },
  sampleEmit,
};
