import common from "../common/base.mjs";

export default {
  ...common,
  key: "taleez-new-job-listed",
  name: "New Job Listing Created",
  description: "Emit new event when a job listing is created in Taleez. [See the documentation](https://api.taleez.com/swagger-ui/index.html#/jobs/list_3)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    unitId: {
      propDefinition: [
        common.props.taleez,
        "unitId",
      ],
    },
    status: {
      propDefinition: [
        common.props.taleez,
        "status",
      ],
    },
    contract: {
      propDefinition: [
        common.props.taleez,
        "contract",
      ],
    },
    city: {
      propDefinition: [
        common.props.taleez,
        "city",
      ],
    },
    companyLabel: {
      propDefinition: [
        common.props.taleez,
        "companyLabel",
      ],
    },
    tag: {
      propDefinition: [
        common.props.taleez,
        "tag",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.taleez.listJobs;
    },
    getArgs() {
      return {
        params: {
          unitId: this.unitId,
          status: this.status,
          contract: this.contract,
          city: this.city,
          companyLabel: this.companyLabel,
          tag: this.tag,
          withDetails: true,
          withProps: true,
        },
      };
    },
    generateMeta(job) {
      return {
        id: job.id,
        summary: `New Job: ${job.label}`,
        ts: job.dateCreation,
      };
    },
  },
};
