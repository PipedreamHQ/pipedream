import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-create-comment",
  name: "Create Comment",
  description: "Create a comment on a selected record. [See the documentation](https://airtable.com/developers/web/api/create-comment)",
  version: "0.0.14",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    recordId: {
      propDefinition: [
        common.props.airtable,
        "recordId",
        ({
          baseId, tableId,
        }) => ({
          baseId: baseId?.value ?? baseId,
          tableId: tableId?.value ?? tableId,
        }),
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The text comment to create",
    },
  },
  async run({ $ }) {
    const response = await this.airtable.createComment({
      baseId: this.baseId?.value ?? this.baseId,
      tableId: this.tableId?.value ?? this.tableId,
      recordId: this.recordId,
      data: {
        text: this.comment,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created comment with ID ${response.id}.`);
    }

    return response;
  },
};
