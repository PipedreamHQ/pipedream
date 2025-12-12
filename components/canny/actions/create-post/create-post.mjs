import canny from "../../canny.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "canny-create-post",
  name: "Create Post",
  description: "Create a post. [See the documentation](https://developers.canny.io/api-reference#create_post)",
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
      description: "The ID of the author of the post",
    },
    boardId: {
      propDefinition: [
        canny,
        "boardId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the post",
    },
    details: {
      type: "string",
      label: "Details",
      description: "The details of the post",
    },
    categoryId: {
      propDefinition: [
        canny,
        "categoryId",
      ],
      optional: true,
    },
    eta: {
      type: "string",
      label: "ETA",
      description: "The estimated date of the post's completion. In the format of MM/YYYY, eg, 06/2022.",
      optional: true,
    },
    etaPublic: {
      type: "boolean",
      label: "ETA Public",
      description: "If the ETA should be made visible to all users",
      optional: true,
    },
    ownerId: {
      propDefinition: [
        canny,
        "userId",
      ],
      label: "Owner ID",
      description: "The ID of the user responsible for the completion of the work described in the post",
      optional: true,
    },
    imageUrls: {
      type: "string[]",
      label: "Image URLs",
      description: "An array of the URLs of post's images",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Fields",
      description: "Any custom fields associated with the post. Each field name (key) must be between 0 and 30 characters long. If field values are strings, they must be less than 200 characters long.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.canny.createPost({
      $,
      data: {
        authorID: this.authorId,
        boardID: this.boardId,
        title: this.title,
        categoryID: this.categoryId,
        details: this.details,
        eta: this.eta,
        etaPublic: this.etaPublic,
        ownerID: this.ownerId,
        imageURLs: this.imageUrls,
        customFields: parseObject(this.customFields),
      },
    });
    $.export("$summary", `Successfully created a post with ID ${response.id}`);
    return response;
  },
};
