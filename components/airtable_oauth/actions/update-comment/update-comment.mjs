import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-update-comment",
  name: "Update Comment",
  description: "Update an existing comment on a selected record. [See the documentation](https://airtable.com/developers/web/api/update-comment)",
  version: "0.0.16",
  annotations: {
    destructiveHint: true,
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
      ],
    },
    commentId: {
      propDefinition: [
        common.props.airtable,
        "commentId",
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "The new content of the comment",
    },
  },
  async run({ $ }) {
    const response = await this.airtable.updateComment({
      baseId: this.baseId,
      tableId: this.tableId,
      recordId: this.recordId,
      commentId: this.commentId,
      data: {
        text: this.comment,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated comment with ID ${response.id}.`);
    }

    return response;
  },
};
