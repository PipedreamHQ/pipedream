import facebookGroups from "../../facebook_groups.app.mjs";

export default {
  key: "facebook_groups-get-post",
  name: "Get Post",
  description: "Retrieves post in a group. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/post/)",
  version: "0.0.1",
  type: "action",
  props: {
    facebookGroups,
    group: {
      propDefinition: [
        facebookGroups,
        "group",
      ],
    },
    post: {
      propDefinition: [
        facebookGroups,
        "post",
        (c) => ({
          group: c.group,
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
