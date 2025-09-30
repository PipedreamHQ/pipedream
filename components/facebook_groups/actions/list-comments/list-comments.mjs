import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-list-comments",
  name: "List Comments",
  description: "Retrieves a list of comments on a group post. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/comment)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    post: {
      propDefinition: [
        common.props.facebookGroups,
        "post",
        (c) => ({
          groupId: c.group,
        }),
      ],
    },
    maxResults: {
      propDefinition: [
        common.props.facebookGroups,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const response = this.paginate({
      fn: this.facebookGroups.listPostComments,
      args: {
        postId: this.post,
        $,
      },
    });

    const comments = [];
    let count = 0;
    for await (const comment of response) {
      comments.push(comment);

      if (this.maxResults && ++count === this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully retrieved ${comments.length} comment${comments.length === 1
      ? ""
      : "s"}`);

    return comments;
  },
};
