import facebookGroups from "../../facebook_groups.app.mjs";

export default {
  key: "facebook_groups-list-comments",
  name: "List Comments",
  description: "Retrieves a list of comments on a group post. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/comment)",
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
    const response = this.facebookGroups.paginate({
      fn: this.facebookGroups.listComments,
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
