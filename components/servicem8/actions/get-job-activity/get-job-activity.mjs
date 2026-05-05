import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-job-activity",
  name: "Get Job Activity",
  description: "Get a job activity by UUID. [See the documentation](https://developer.servicem8.com/reference/getjobactivities)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      label: "Job activity",
      description: "Select the job activity to retrieve (search or paste UUID).",
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
    const response = await this.servicem8.getResource({
      $,
      resource: "jobactivity",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job Activity ${this.uuid}`);
    return response;
  },
};
