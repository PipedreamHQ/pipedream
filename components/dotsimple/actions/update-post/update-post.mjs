import app from "../../dotsimple.app.mjs";

export default {
  key: "dotsimple-update-post",
  name: "Update Post",
  description: "Amend an existing post on your DotSimple site. [See the documentation](https://help.dotsimple.io/en/articles/68-posts)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    postId: {
      propDefinition: [
        app,
        "postId",
      ],
    },
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    body: {
      propDefinition: [
        app,
        "contentBody",
      ],
    },
    url: {
      propDefinition: [
        app,
        "contentUrl",
      ],
    },
  },
  methods: {
    updatePost({
      postId, ...args
    } = {}) {
      return this.app.put({
        path: `/posts/${postId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updatePost,
      postId,
      accountId,
      body,
      url,
    } = this;

    const response = await updatePost({
      $,
      postId,
      data: {
        accounts: [
          accountId,
        ],
        versions: [
          {
            account_id: accountId,
            is_original: true,
            content: [
              {
                body,
                url,
              },
            ],
          },
        ],
      },
    });

    $.export("$summary", "Successfully updated post.");

    return response;
  },
};
