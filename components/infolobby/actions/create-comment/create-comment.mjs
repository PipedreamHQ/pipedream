import app from "../../infolobby.app.mjs";

export default {
  key: "infolobby-create-comment",
  name: "Create Comment",
  description: "Create a new Comment for a record. [See the documentation](https://infolobby.com/site/apidocs/4/working-with-record-comments/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    tableId: {
      propDefinition: [
        app,
        "tableId",
      ],
    },
    itemId: {
      propDefinition: [
        app,
        "itemId",
        (c) => ({
          tableId: c.tableId,
        }),
      ],
    },
    comment: {
      propDefinition: [
        app,
        "comment",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createComment({
      $,
      tableId: this.tableId,
      itemId: this.itemId,
      data: {
        comment: this.comment,
      },

    });

    $.export("$summary", `Successfully created Comment with ID '${response}'`);

    return response;
  },
};
