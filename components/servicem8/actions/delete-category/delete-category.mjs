import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-category",
  name: "Delete Category",
  description: "Delete a category by UUID. [See the documentation](https://developer.servicem8.com/reference/deletecategories)",
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
      label: "Category",
      description: "Select the category to delete (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "category",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "category",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Category ${this.uuid}`);
    return response;
  },
};
