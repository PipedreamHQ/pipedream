import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-dboattachment",
  name: "Get Attachment",
  description: "Get an attachment by UUID. [See the documentation](https://developer.servicem8.com/reference/getattachments)",
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
      label: "Attachment",
      description: "Select the attachment to retrieve (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "dboattachment",
          prevContext,
          query,
        });
      },
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "dboattachment",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Attachment ${this.uuid}`);
    return response;
  },
};
