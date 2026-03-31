import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-company",
  name: "Delete Company",
  description: "Delete a company by UUID. [See the documentation](https://developer.servicem8.com/reference/deleteclients)",
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
      label: "Company",
      description: "Select the company to delete (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "company",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "company",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Company ${this.uuid}`);
    return response;
  },
};
