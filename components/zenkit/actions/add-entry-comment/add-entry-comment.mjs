import common from "../common/common.mjs";

export default {
  ...common,
  key: "zenkit-add-entry-comment",
  name: "Add Entry Comment",
  description: "Add a comment to an entry/item within a list/collection on Zenkit. [See the docs](https://base.zenkit.com/docs/api/activity/post-api-v1-users-me-lists-listallid-entries-listentryallid-activities)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.zenkit,
        "listId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    entryId: {
      propDefinition: [
        common.props.zenkit,
        "entryId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment to add to entry",
    },
  },
  async run({ $ }) {
    const response = await this.zenkit.addCommentToEntry({
      listId: this.listId,
      entryId: this.entryId,
      data: {
        message: this.comment,
      },
      $,
    });
    $.export("$summary", `Successfully added comment to entry '${response?.listEntryDisplayString}'`);
    return response;
  },
};
