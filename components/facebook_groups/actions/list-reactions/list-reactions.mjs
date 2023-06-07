import facebookGroups from "../../facebook_groups.app.mjs";

export default {
  key: "facebook_groups-list-reactions",
  name: "List Reactions",
  description: "Retrieves a list of reactions on a group post. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/object/reactions)",
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
      fn: this.facebookGroups.listReactions,
      args: {
        postId: this.post,
        $,
      },
    });

    const reactions = [];
    let count = 0;
    for await (const reaction of response) {
      reactions.push(reaction);
      if (this.maxResults && ++count === this.maxResults) {
        break;
      }
    }

    $.export("$summary", `Successfully retrieved ${reactions.length} reaction${reactions.length === 1
      ? ""
      : "s"}`);

    return reactions;
  },
};
