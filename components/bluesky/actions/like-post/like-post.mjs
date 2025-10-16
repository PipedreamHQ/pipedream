import app from "../../bluesky.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "bluesky-like-post",
  name: "Like Post",
  description: "Like a specific post on Bluesky. [See the documentation](https://docs.bsky.app/docs/api/com-atproto-repo-create-record).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    postUrl: {
      propDefinition: [
        app,
        "postUrl",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      postUrl,
    } = this;

    const {
      handle,
      postId,
    } = app.getHandleAndPostIdFromUrl(postUrl);

    const {
      uri,
      cid,
    } = await app.getRecord({
      $,
      params: {
        repo: handle,
        collection: constants.RESOURCE_TYPE.POST,
        rkey: postId,
      },
    });

    const response = await app.createRecord({
      $,
      data: {
        collection: constants.RESOURCE_TYPE.LIKE,
        record: {
          ["$type"]: constants.RESOURCE_TYPE.LIKE,
          createdAt: new Date().toISOString(),
          subject: {
            uri,
            cid,
            py_type: "com.atproto.repo.strongRef",
          },
        },
      },
    });

    $.export("$summary", "Successfully liked post.");
    return response;
  },
};
