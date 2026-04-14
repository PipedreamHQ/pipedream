import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-queue",
  name: "Get Queue",
  description: "Get a job queue by UUID. [See the documentation](https://developer.servicem8.com/reference/getjobqueues)",
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
      label: "Queue",
      description: "Select the queue to retrieve (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "queue",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "queue",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Queue ${this.uuid}`);
    return response;
  },
};
