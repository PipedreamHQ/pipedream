import common from "../common/common.mjs";

export default {
  ...common,
  key: "facebook_groups-list-reactions",
  name: "List Reactions",
  description: "Retrieves a list of reactions on a group post. [See the documentation](https://developers.facebook.com/docs/graph-api/reference/v17.0/object/reactions)",
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
  },
  async run({ $ }) {
    const reactions = await this.getResources({
      fn: this.facebookGroups.listReactions,
      args: {
        postId: this.post,
        $,
      },
      maxResults: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${reactions.length} reaction${reactions.length === 1
      ? ""
      : "s"}`);

    return reactions;
  },
};
