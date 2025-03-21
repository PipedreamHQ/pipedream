import splunk from "../../splunk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    splunk,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    selfSigned: {
      propDefinition: [
        splunk,
        "selfSigned",
      ],
    },
  },
  methods: {
    async getRecentJobIds() {
      const results = this.splunk.paginate({
        resourceFn: this.splunk.listJobs,
        args: {
          selfSigned: this.selfSigned,
        },
      });
      const jobIds = [];
      for await (const job of results) {
        jobIds.push(job.content.sid);
      }
      return jobIds;
    },
  },
};
