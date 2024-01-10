import ezeepBlue from "../../ezeep_blue.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ezeep_blue-print-job-completed",
  name: "Print Job Completed",
  description: "Emits an event when a print job status is 0. [See the documentation](https://developer.ezeep.com)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ezeepBlue,
    jobid: {
      propDefinition: [
        ezeepBlue,
        "jobid",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // run every minute
      },
    },
  },
  hooks: {
    async deploy() {
      // Emit the last status for the current jobid on deploy
      const jobStatus = await this.ezeepBlue.checkPrintJobStatus({
        jobid: this.jobid,
      });
      if (jobStatus === 0) {
        this.$emit({
          jobid: this.jobid,
          status: jobStatus,
        }, {
          id: this.jobid,
          summary: `Print job ${this.jobid} completed`,
          ts: Date.now(),
        });
      }
    },
  },
  methods: {
    async updateLastCheck(currentCheck) {
      await this.db.set("lastCheck", currentCheck);
    },
    async getLastCheck() {
      return this.db.get("lastCheck") || 0;
    },
  },
  async run() {
    const lastCheck = await this.getLastCheck();
    const currentCheck = Date.now();

    // Check the print job status
    const jobStatus = await this.ezeepBlue.checkPrintJobStatus({
      jobid: this.jobid,
    });

    // Emit an event if the status is 0 and the job was not completed in the last check
    if (jobStatus === 0 && lastCheck < currentCheck) {
      this.$emit({
        jobid: this.jobid,
        status: jobStatus,
      }, {
        id: this.jobid,
        summary: `Print job ${this.jobid} completed`,
        ts: currentCheck,
      });
    }

    // Update the last check timestamp
    await this.updateLastCheck(currentCheck);
  },
};
