import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-staff",
  name: "Get Staff",
  description: "Get a staff member by UUID. [See the documentation](https://developer.servicem8.com/reference/getstaffmembers)",
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
      label: "Staff member",
      description: "Select the staff member to retrieve (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "staff",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "staff",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Staff ${this.uuid}`);
    return response;
  },
};
