import app from "../../bluesky.app.mjs";

export default {
  key: "bluesky-retrieve-thread",
  name: "Retrieve Thread",
  description: "Retrieve a full thread of posts. [See the documentation](https://docs.bsky.app/docs/api/app-bsky-feed-get-post-thread).",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    postUrl: {
      propDefinition: [
        app,
        "postUrl",
      ],
    },
    depth: {
      type: "integer",
      label: "Depth",
      description: "How many levels of reply depth should be included in response. Default is `6`.",
      optional: true,
      max: 100,
    },
    parentHeight: {
      type: "integer",
      label: "Parent Height",
      description: "How many levels of parent (and grandparent, etc) post to include. Default is `80`.",
      optional: true,
      max: 100,
    },
  },
  methods: {
    getPostThread(args = {}) {
      return this.app._makeRequest({
        path: "/app.bsky.feed.getPostThread",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      app,
      getPostThread,
      postUrl,
      depth,
      parentHeight,
    } = this;

    const {
      handle,
      postId,
    } = app.getHandleAndPostIdFromUrl(postUrl);

    const { did } = await app.resolveHandle({
      $,
      params: {
        handle,
      },
    });

    const response = await getPostThread({
      $,
      params: {
        uri: app.getPostUri(postId, did),
        depth,
        parentHeight,
      },
    });

    $.export("$summary", "Successfully retrieved thread.");
    return response;
  },
};
