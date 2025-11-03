import asters from "../../asters.app.mjs";

export default {
  key: "asters-list-posts-analytics",
  name: "List Posts Analytics",
  description: "Retrieve the list of posts' analytics of a social account. [See the documentation](https://docs.asters.ai/api/endpoints/analytics)",
  type: "action",
  version: "0.0.2",
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
      fn: this.asters.listPostAnalytics,
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
