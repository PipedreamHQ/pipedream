import leadboxer from "../../leadboxer.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "leadboxer-new-lead-added",
  name: "New Lead Added",
  description: "Emit new event when a new lead is added to the Leadboxer dataset. [See the documentation](https://developers.leadboxer.com/reference/users)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    leadboxer,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run() {
    const { data } = await this.leadboxer.listLeads({
      params: {
        criteriaTimeFilter: "first_session_unix_timestamp|lessthan|6", // last 7 days
        sortBy: "lastEvent|desc",
      },
    });
    for (const lead of data.reverse()) {
      this.$emit(lead, {
        id: lead.use_id,
        summary: `New Lead with ID: ${lead.use_id}`,
        ts: lead.first_session_unix_timestamp,
      });
    }
  },
  sampleEmit,
};
