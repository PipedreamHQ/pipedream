import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-update-category",
  name: "Update Category",
  description: "Update a category (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatecategories)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
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
      label: "Category to update",
      description: "Category record to load, merge, and save (search or paste UUID).",
    },
    name: {
      type: "string",
      label: "Name",
      optional: true,
      description: "Job category name.",
    },
    colour: {
      type: "string",
      label: "Colour",
      optional: true,
      description: "Hex colour (6 characters 0-9a-f).",
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateCategory({
      $,
      uuid: this.uuid,
      data: {
        name: this.name,
        colour: this.colour,
      },
    });
    $.export("$summary", `Updated Category ${this.uuid}`);
    return response;
  },
};
