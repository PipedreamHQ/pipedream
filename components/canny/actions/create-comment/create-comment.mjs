import canny from "../../canny.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "canny-create-comment",
  name: "Create Comment",
  description: "Create a comment. [See the documentation](https://developers.canny.io/api-reference#create_comment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    canny,
    authorId: {
      propDefinition: [
        canny,
        "userId",
      ],
      label: "Author ID",
      description: "The ID of the author of the comment",
    },
    postId: {
      propDefinition: [
        canny,
        "postId",
      ],
      description: "The ID of the post to comment on",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The comment value. Optional if imageURLs are provided. Must be under 2500 characters.",
      optional: true,
    },
    imageUrls: {
      type: "string[]",
      label: "Image URLs",
      description: "An array of the URLs of comment's images",
      optional: true,
    },
    parentId: {
      propDefinition: [
        canny,
        "commentId",
      ],
      label: "Parent ID",
      description: "The ID of the parent comment",
      optional: true,
    },
    shouldNotifyVoters: {
      type: "boolean",
      label: "Should Notify Voters",
      description: "Whether this comment should be allowed to trigger email notifications. Default is false.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.value && !this.imageUrls) {
      throw new ConfigurationError("Either value or imageUrls must be provided");
    }

    const response = await this.canny.createComment({
      $,
      data: {
        authorID: this.authorId,
        postID: this.postId,
        value: this.value,
        imageURLs: this.imageUrls,
        parentID: this.parentId,
        shouldNotifyVoters: this.shouldNotifyVoters,
      },
    });
    $.export("$summary", `Successfully created comment with ID ${response.id}`);
    return response;
  },
};
