import app from "../../dotsimple.app.mjs";

export default {
  key: "dotsimple-create-post",
  name: "Create Post",
  description: "Create a new post on your DotSimple site. [See the documentation](https://help.dotsimple.io/en/articles/68-posts).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
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
    createPost(args = {}) {
      return this.app.post({
        path: "/posts",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createPost,
      accountId,
      body,
      url,
    } = this;

    const response = await createPost({
      $,
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

    $.export("$summary", `Successfully created a new post with ID \`${response.id}\``);

    return response;
  },
};
