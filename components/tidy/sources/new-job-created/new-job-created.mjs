import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "tidy-new-job-created",
  name: "New Job Created",
  description: "Emit new event when a new job is created in Tidy",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    addressId: {
      propDefinition: [
        common.props.tidy,
        "addressId",
      ],
    },
    toDoListIds: {
      propDefinition: [
        common.props.tidy,
        "toDoListIds",
        (c) => ({
          addressId: c.addressId,
        }),
      ],
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter jobs by status or statuses",
      options: constants.JOB_STATUS,
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getItems() {
      const { data } = await this.tidy.listJobs({
        params: {
          address_id: this.addressId,
          to_do_list_id: this.toDoListIds?.length
            ? (this.toDoListIds).join()
            : undefined,
          status: this.status?.length
            ? (this.status).join()
            : undefined,
        },
      });
      return data;
    },
    generateMeta(job) {
      return {
        id: job.id,
        summary: `New Job ID ${job.id}`,
        ts: Date.parse(job.created_at),
      };
    },
  },
};
