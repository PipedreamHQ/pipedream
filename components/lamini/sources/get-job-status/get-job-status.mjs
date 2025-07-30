import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../lamini.app.mjs";

export default {
  key: "lamini-get-job-status",
  name: "New Job Status",
  description: "Emit new events with the status of a training job. [See the documentation](https://docs.lamini.ai/api/).",
  version: "0.0.2",
  type: "source",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
    },
  },
  methods: {
    processEvent(response) {
      const ts = Date.now();
      this.$emit(response, {
        id: `${this.jobId}-${ts}`,
        summary: `New Status ${response.status}`,
        ts,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      processEvent,
      jobId,
    } = this;

    let response;

    try {
      response = await app.getJobStatus({
        $,
        jobId,
      });

    } catch (error) {
      if (error.status === 524 && error.data === "") {
        throw new ConfigurationError(`Job \`${jobId}\` status is not COMPLETED, current status: failed.`);
      }
      console.log("Failed to fetch job status", JSON.stringify(error.message));
      throw new ConfigurationError("Failed to fetch job status");
    }

    processEvent(response);
  },
};
