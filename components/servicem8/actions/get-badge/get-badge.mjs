import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-badge",
  name: "Get Badge",
  description: "Get a badge by UUID. [See the documentation](https://developer.servicem8.com/reference/getbadges)",
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
      label: "Badge",
      description: "Select the badge to retrieve (search or paste UUID).",
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
    const response = await this.servicem8.getResource({
      $,
      resource: "badge",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Badge ${this.uuid}`);
    return response;
  },
};
