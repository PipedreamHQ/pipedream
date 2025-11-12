import asters from "../../asters.app.mjs";

export default {
  key: "asters-list-posts",
  name: "List Posts",
  description: "Retrieve a list of posts of a social profile. [See the documentation](https://docs.asters.ai/api/endpoints/posts)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    asters,
    workspaceId: {
      propDefinition: [
        asters,
        "workspaceId",
      ],
    },
    socialAccountId: {
      propDefinition: [
        asters,
        "socialAccountId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    fromDate: {
      propDefinition: [
        asters,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        asters,
        "toDate",
      ],
    },
  },
  async run({ $ }) {
    const posts = await this.asters.getPaginatedResources({
      fn: this.asters.listPosts,
      args: {
        data: {
          socialAccountId: this.socialAccountId,
          filters: {
            date: {
              from: this.fromDate,
              to: this.toDate,
            },
          },
        },
      },
    });
    $.export("$summary", `Successfully retrieved ${posts.length} post${posts.length === 1
      ? ""
      : "s"}`);
    return posts;
  },
};
