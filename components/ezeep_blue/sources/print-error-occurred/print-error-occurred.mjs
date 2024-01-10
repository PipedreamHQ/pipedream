import ezeepBlue from "../../ezeep_blue.app.mjs";
import { axios } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";

export default {
  key: "ezeep_blue-print-error-occurred",
  name: "Print Error Occurred",
  description: "Emits an event when a print job error with status 3011 or 2 occurs. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ezeepBlue,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    jobid: {
      propDefinition: [
        ezeepBlue,
        "jobid",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit at most 50 events in order of most recent to least recent
      let page = 0;
      let errorEvents = [];
      let hasMore = true;

      while (hasMore && errorEvents.length < 50) {
        const {
          errors, pagination,
        } = await this.ezeepBlue.checkPrintJobStatus({
          jobid: this.jobid,
          page,
        });

        errorEvents = [
          ...errorEvents,
          ...errors,
        ];
        hasMore = pagination.hasMore;
        page++;
      }

      errorEvents.slice(0, 50).forEach((error) => {
        this.$emit(error, {
          id: error.id,
          summary: `Error with Job ID: ${error.jobid}`,
          ts: Date.parse(error.created_at),
        });
      });
    },
    async activate() {
      // No webhook subscription needed for this source
    },
    async deactivate() {
      // No webhook subscription to delete for this source
    },
  },
  methods: {
    isTriggerStatus(status) {
      return [
        3011,
        2,
      ].includes(status);
    },
  },
  async run() {
    // Check the status of the print job
    const lastStatus = this.db.get("lastStatus") || {};
    const currentStatus = await this.ezeepBlue.checkPrintJobStatus({
      jobid: this.jobid,
    });

    if (this.isTriggerStatus(currentStatus) && lastStatus[this.jobid] !== currentStatus) {
      this.$emit({
        jobid: this.jobid,
        status: currentStatus,
      }, {
        id: `${this.jobid}-${currentStatus}`,
        summary: `Print job with ID ${this.jobid} has error status ${currentStatus}`,
        ts: Date.now(),
      });

      // Save the status to the db
      lastStatus[this.jobid] = currentStatus;
      this.db.set("lastStatus", lastStatus);
    }
  },
};
