import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-get-post",
  name: "Get Post",
  description: "Retrieves post in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/post/)",
  version: "0.0.2",
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
  },
  async run({ $ }) {
    const response = this.facebookGroups.getPost({
      postId: this.post,
      $,
    });

    $.export("$summary", `Successfully retrieved post with ID ${this.post}`);

    return response;
  },
};
