import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-job",
  name: "Get Job",
  description: "Get a job by UUID. [See the documentation](https://developer.servicem8.com/reference/getjobs)",
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
      label: "Job",
      description: "Select the job to retrieve (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "job",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "job",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job ${this.uuid}`);
    return response;
  },
};
