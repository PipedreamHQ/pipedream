import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-pending-followers",
  name: "List Pending Followers",
  description: "Return a collection of numeric IDs for every user who has a pending request to follow the authenticated user",
  version: "0.0.1",
  type: "action",
  async run() {
    const followers = await this.paginate(this.twitter.getPendingFollowers.bind(this), {}, "ids");
    const results = [];
    for await (const follower of followers) {
      results.push(follower);
    }
    return results;
  },
};
