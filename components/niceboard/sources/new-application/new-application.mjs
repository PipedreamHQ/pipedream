import niceboard from "../../niceboard.app.mjs";

export default {
  key: "niceboard-new-application",
  name: "New Application",
  description: "Emit new event when a new application is submitted to a job",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    niceboard,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    jobId: {
      propDefinition: [
        niceboard,
        "jobId",
      ],
    },
    applicantId: {
      propDefinition: [
        niceboard,
        "applicantId",
      ],
    },
    applicantDetails: {
      propDefinition: [
        niceboard,
        "applicantDetails",
        {
          optional: true,
        },
      ],
    },
    jobDetails: {
      propDefinition: [
        niceboard,
        "jobDetails",
        {
          optional: true,
        },
      ],
    },
  },
  methods: {
    _getApplicantId() {
      return this.db.get("applicantId") || this.applicantId;
    },
    _setApplicantId(id) {
      this.db.set("applicantId", id);
    },
  },
  async run() {
    const lastApplicantId = this._getApplicantId();
    const applicants = await this.niceboard.getApplicants({
      jobId: this.jobId,
    });

    for (const applicant of applicants) {
      if (applicant.id !== lastApplicantId) {
        this.$emit(applicant, {
          id: applicant.id,
          summary: `New application from ${applicant.name}`,
          ts: Date.now(),
        });
      } else {
        break;
      }
    }

    this._setApplicantId(applicants[0].id);
  },
};
