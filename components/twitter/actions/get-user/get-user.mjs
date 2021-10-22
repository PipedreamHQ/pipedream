import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-get-user",
  name: "Get User",
  description: "Return information about the user specified by ID or screen name parameter",
  version: "0.0.1",
  type: "action",
  props: {
    twitter,
    userId: {
      propDefinition: [
        twitter,
        "userId",
      ],
      optional: true,
    },
    screenName: {
      propDefinition: [
        twitter,
        "screenName",
      ],
      optional: true,
    },
  },
  async run() {
    const {
      userId,
      screenName,
    } = this;

    if (!userId && !screenName) {
      throw new Error("This action requires either User ID or Screen Name. Please enter one or the other above.");
    }

    return await this.twitter.lookupUsers([
      userId,
    ], [
      screenName,
    ]);
  },
};
