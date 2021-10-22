import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-lists",
  name: "List Lists",
  description: "Return all lists the authenticated or specified user subscribes to including their own",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        common.props.twitter,
        "userId",
      ],
      optional: true,
    },
    screenName: {
      propDefinition: [
        common.props.twitter,
        "screenName",
      ],
    },
    reverse: {
      type: "boolean",
      label: "Reverse",
      description: "Set this to `true` if you would like owned lists to be returned first.",
      optional: true,
      default: false,
    },
  },
  async run() {
    const {
      userId,
      screenName,
      reverse,
    } = this;

    if (!userId && !screenName) {
      throw new Error("This action requires either User ID or Screen Name. Please enter one or the other above.");
    }

    const params = {
      user_id: userId,
      screen_name: screenName,
      reverse,
    };
    const lists = await this.paginate(this.twitter.getLists.bind(this), params);
    const results = [];
    for await (const list of lists) {
      results.push(list);
    }
    return results;
  },
};
