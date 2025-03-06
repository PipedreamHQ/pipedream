import common from "../common/base.mjs";

export default {
  ...common,
  key: "hr_cloud-new-applicant-created",
  name: "New Applicant Created",
  description: "Emit new event when a new applicant is created. [See the documentation](https://help.hrcloud.com/api/#/applicant#GET_applicants)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.hrCloud.getApplicants;
    },
    getTsField() {
      return "xAppliedOn";
    },
    generateMeta(applicant) {
      return {
        id: applicant.Id,
        summary: `New Applicant: ${applicant.xFirstName} ${applicant.xLastName}`,
        ts: Date.parse(applicant[this.getTsField()]),
      };
    },
  },
};
