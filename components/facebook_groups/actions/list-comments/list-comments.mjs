import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-list-comments",
  name: "List Comments",
  description: "Retrieves a list of comments on a group post. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/comment)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    post: {
      propDefinition: [
        common.props.facebookGroups,
        "post",
        (c) => ({
          group: c.group,
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
    const comments = await this.getResources({
      fn: this.facebookGroups.listComments,
      args: {
        postId: this.post,
        $,
      },
      maxResults: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${comments.length} comment${comments.length === 1
      ? ""
      : "s"}`);

    return comments;
  },
};
