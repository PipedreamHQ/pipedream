import { parseObject } from "../../common/utils.mjs";
import kintone from "../../kintone.app.mjs";

export default {
  key: "kintone-add-comment",
  name: "Add Comment",
  description: "Adds a comment to a record in a Kintone App. [See the documentation](https://kintone.dev/en/docs/kintone/rest-api/records/add-comment/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    kintone,
    appId: {
      propDefinition: [
        kintone,
        "appId",
      ],
    },
    recordId: {
      propDefinition: [
        kintone,
        "recordId",
        ({ appId }) => ({
          appId,
        }),
      ],
    },
    commentText: {
      type: "string",
      label: "Comment Text",
      description: "The comment text (max 65,535 characters)",
    },
    mentions: {
      type: "object",
      label: "Mentions",
      description: "Optional array of mentions. Example: `[{\"code\": \"user_code\", \"type\": \"USER\"}]` (USER, GROUP, or ORGANIZATION)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kintone.addComment({
      $,
      data: {
        app: this.appId,
        record: this.recordId,
        comment: {
          text: this.commentText,
          ...(this.mentions && {
            mentions: parseObject(this.mentions),
          }),
        },
      },
    });

    $.export("$summary", `Successfully added comment with ID: ${response.id}`);
    return response;
  },
};
