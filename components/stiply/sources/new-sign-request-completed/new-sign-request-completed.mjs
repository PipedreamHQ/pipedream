import stiply from "../../stiply.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "stiply-new-sign-request-completed",
  name: "New Sign Request Completed",
  description: "Emit new event when a sign request is completed in Stiply. [See the documentation](https://app.stiply.nl/api-documentation/v2#tag/sign-requests/operation/GetSignRequests).",
  type: "source",
  dedupe: "unique",
  version: "0.0.1",
  props: {
    stiply,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New sign request completed: ${item.id}`,
        ts: Date.parse(item.updated_at),
      };
    },
  },
  async run() {
    const signRequests = await this.stiply.getPaginatedResults({
      fn: this.stiply.listSignRequests,
      params: {
        $orderby: "updated_at desc",
        status: "completed",
      },
    });
    signRequests.forEach((signRequest) => {
      const meta = this.generateMeta(signRequest);
      this.$emit(signRequest, meta);
    });
  },
  sampleEmit,
};
