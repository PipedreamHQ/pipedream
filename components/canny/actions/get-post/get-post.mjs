import canny from "../../canny.app.mjs";

export default {
  key: "canny-get-post",
  name: "Get Post",
  description: "Get a post. [See the documentation](https://developers.canny.io/api-reference#retrieve_post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    canny,
    boardId: {
      propDefinition: [
        canny,
        "boardId",
      ],
      optional: true,
    },
    postId: {
      propDefinition: [
        canny,
        "postId",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      optional: true,
    },
    urlName: {
      type: "string",
      label: "URL Name",
      description: "The post's unique urlName",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.canny.getPost({
      $,
      data: {
        boardID: this.boardId,
        urlName: this.urlName,
        id: this.postId,
      },
    });
    $.export("$summary", `Successfully retrieved post ${this.postId}`);
    return response;
  },
};
