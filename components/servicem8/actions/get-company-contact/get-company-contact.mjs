import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-company-contact",
  name: "Get Company Contact",
  description: "Get a company contact by UUID. [See the documentation](https://developer.servicem8.com/reference/getcompanycontacts)",
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
      label: "Company contact",
      description: "Select the company contact to retrieve (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "companycontact",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "companycontact",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Company Contact ${this.uuid}`);
    return response;
  },
};
