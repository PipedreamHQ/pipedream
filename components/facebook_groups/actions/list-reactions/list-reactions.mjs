import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-list-reactions",
  name: "List Reactions",
  description: "Retrieves a list of reactions on a group post. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/object/reactions)",
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
      fn: this.facebookGroups.listPostReactions,
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
