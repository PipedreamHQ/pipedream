import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-job-material",
  name: "Delete Job Material",
  description: "Delete a job material by UUID. [See the documentation](https://developer.servicem8.com/reference/deletejobmaterials)",
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
      label: "Job material",
      description: "Select the job material to delete (search or paste UUID).",
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
    const response = await this.servicem8.deleteResource({
      $,
      resource: "jobmaterial",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Job Material ${this.uuid}`);
    return response;
  },
};
