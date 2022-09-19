import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-pending-followers",
  name: "List Pending Followers",
  description: "Return a collection of numeric IDs for every user who has a pending request to follow the authenticated user. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-friendships-incoming)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    maxRequests: {
      propDefinition: [
        common.props.twitter,
        "maxRequests",
      ],
    },
  },
  async run({ $ }) {
    const { maxRequests } = this;
    const followers = await this.paginate(this.twitter.getPendingFollowers.bind(this), {
      $,
      maxRequests,
    }, "ids");
    const results = [];
    for await (const follower of followers) {
      results.push(follower);
    }
    $.export("$summary", "Successfully retrieved pending followers");
    return results;
  },
};
