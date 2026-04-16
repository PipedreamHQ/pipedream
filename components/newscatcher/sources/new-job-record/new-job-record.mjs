import newscatcher from "../../newscatcher.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "newscatcher-new-job-record",
  name: "New Job Record (Instant)",
  description: "Emit new event when a new job record is retrieved from a monitor job. [See the documentation](https://www.newscatcherapi.com/docs/web-search-api/api-reference/jobs/get-job-results)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    newscatcher,
    db: "$.service.db",
    http: "$.interface.http",
    referenceJobId: {
      propDefinition: [
        newscatcher,
        "jobId",
      ],
      description: "Job ID to use as template for scheduled runs. Job's end_date must be within the last 7 days. Only one monitor can be created per job.",
    },
    schedule: {
      type: "string",
      label: "Schedule",
      description: "Natural language schedule (e.g. 'every day at 12 AM EST'). Minimum frequency: Monitors must be scheduled at least 24 hours apart. Example: `every day at 12 PM UTC`",
    },
  },
  hooks: {
    async activate() {
      const monitorId = this._getMonitorId() || await this._createMonitor();
      await this.newscatcher.enableMonitor({
        monitorId,
      });
    },
    async deactivate() {
      const monitorId = this._getMonitorId();
      if (monitorId) {
        await this.newscatcher.disableMonitor({
          monitorId,
        });
      }
    },
  },
  methods: {
    _getMonitorId() {
      return this.db.get("monitorId");
    },
    _setMonitorId(id) {
      this.db.set("monitorId", id);
    },
    async _createMonitor() {
      const { monitor_id: monitorId } = await this.newscatcher.createMonitor({
        data: {
          reference_job_id: this.referenceJobId,
          schedule: this.schedule,
          webhook: {
            url: this.http.endpoint,
          },
        },
      });
      this._setMonitorId(monitorId);
      return monitorId;
    },
    generateMeta(record) {
      return {
        id: record.record_id,
        summary: `New Record: ${record.record_title}`,
        ts: Date.parse(record.added_on),
      };
    },
  },
  async run({ body }) {
    const { records } = body;

    if (!records?.length) {
      return;
    }

    for (const record of records) {
      const meta = this.generateMeta(record);
      this.$emit(record, meta);
    }
  },
  sampleEmit,
};
