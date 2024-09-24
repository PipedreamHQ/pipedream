import { axios } from "@pipedream/platform";
import talenthr from "../../talenthr.app.mjs";

export default {
  key: "talenthr-new-ats-application-instant",
  name: "New Job Application Submitted",
  description: "Emit new event when a new job application is submitted. [See the documentation](https://apidocs.talenthr.io/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    talenthr,
    db: "$.service.db",
    jobPosition: {
      propDefinition: [
        talenthr,
        "jobPosition",
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const jobApplications = await this.talenthr.listNewJobApplications({
        jobPosition: this.jobPosition,
      });

      jobApplications.slice(0, 50).forEach((application) => {
        this.$emit(application, {
          id: application.id,
          summary: `New Job Application: ${application.id}`,
          ts: Date.parse(application.created_at),
        });
      });
    },
    async activate() {},
    async deactivate() {},
  },
  methods: {
    _getLastChecked() {
      return this.db.get("lastChecked") || Date.now();
    },
    _setLastChecked(lastChecked) {
      this.db.set("lastChecked", lastChecked);
    },
    async emitApplicationEvents(applications) {
      for (const application of applications) {
        this.$emit(application, {
          id: application.id,
          summary: `New Job Application: ${application.id}`,
          ts: Date.parse(application.created_at),
        });
      }
    },
  },
  async run() {
    const lastChecked = this._getLastChecked();
    const jobPosition = this.jobPosition;
    const applications = await this.talenthr.listNewJobApplications({
      jobPosition,
      params: {
        since: new Date(lastChecked).toISOString(),
      },
    });
    await this.emitApplicationEvents(applications);
    this._setLastChecked(Date.now());
  },
};
