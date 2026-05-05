import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-dboattachment",
  name: "Delete Attachment",
  description: "Delete an attachment by UUID. [See the documentation](https://developer.servicem8.com/reference/deleteattachments)",
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
      label: "Attachment",
      description: "Select the attachment to delete (search or paste UUID).",
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
    const response = await this.servicem8.deleteResource({
      $,
      resource: "dboattachment",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Attachment ${this.uuid}`);
    return response;
  },
};
