import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-job-material",
  name: "Get Job Material",
  description: "Get a job material by UUID. [See the documentation](https://developer.servicem8.com/reference/getjobmaterials)",
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
      label: "Job material",
      description: "Select the job material to retrieve (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "jobmaterial",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "jobmaterial",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job Material ${this.uuid}`);
    return response;
  },
};
