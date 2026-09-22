import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-badge",
  name: "Delete Badge",
  description: "Delete a badge by UUID. [See the documentation](https://developer.servicem8.com/reference/deletebadges)",
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
      label: "Badge",
      description: "Select the badge to delete (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "badge",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "badge",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Badge ${this.uuid}`);
    return response;
  },
};
