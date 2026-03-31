import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-company",
  name: "Get Company",
  description: "Get a company by UUID. [See the documentation](https://developer.servicem8.com/reference/getclients)",
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
      label: "Company",
      description: "Select the company to retrieve (search or paste UUID).",
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
    const response = await this.servicem8.getResource({
      $,
      resource: "company",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Company ${this.uuid}`);
    return response;
  },
};
