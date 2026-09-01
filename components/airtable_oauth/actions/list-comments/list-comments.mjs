// x-pd-ai: optimized
import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-list-comments",
  name: "List Comments",
  description: "Get a list of comments on a selected record, e.g. to look up a comment's ID before updating it. [See the documentation](https://airtable.com/developers/web/api/list-comments)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const { comments } = await this.airtable.listComments({
      baseId: this.baseId,
      tableId: this.tableId,
      recordId: this.recordId,
      $,
    });

    $.export("$summary", `Successfully retrieved ${comments.length} comment${comments.length === 1
      ? ""
      : "s"}.`);

    return comments;
  },
};
