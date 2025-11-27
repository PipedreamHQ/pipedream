import { parseObject } from "../../common/utils.mjs";
import app from "../../encharge.app.mjs";

export default {
  key: "encharge-remove-tags",
  name: "Remove Tags",
  description: "Remove tag(s) from existing user. [See the documentation](https://app-encharge-resources.s3.amazonaws.com/#/tags/removetag)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "UserID of the person.",
    },
    tags: {
      propDefinition: [
        app,
        "tags",
        ({ userId }) => ({
          userId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const tags = parseObject(this.tags);
    const tagsArray = Array.isArray(tags)
      ? tags
      : [
        tags,
      ];
    const response = await this.app.removeTag({
      $,
      data: {
        tag: tagsArray.join(","),
        id: this.userId,
      },
    });
    $.export("$summary", `Successfully removed ${tagsArray.length} tag${tagsArray.length > 1
      ? "s"
      : ""} from person with ID ${this.userId}`);
    return response;
  },
};
