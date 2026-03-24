import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-job-activity",
  name: "Delete Job Activity",
  description: "Delete a job activity by UUID. [See the documentation](https://developer.servicem8.com/reference/deletejobactivities)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      label: "Job activity",
      description: "Select the job activity to delete (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "jobactivity",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "jobactivity",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Job Activity ${this.uuid}`);
    return response;
  },
};
