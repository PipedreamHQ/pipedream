import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-add-user-to-list",
  name: "Add User To List",
  description: "Add a member to a list. The authenticated user must own the list to be able to add members to it. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/post-lists-members-create)",
  version: "0.0.2",
  type: "action",
  props: {
    twitter,
    list: {
      propDefinition: [
        twitter,
        "listSlug",
      ],
    },
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
  async run({ $ }) {
    const {
      list,
      userId,
      screenName,
    } = this;

    if (!userId && !screenName) {
      throw new Error("This action requires either User ID or Screen Name. Please enter one or the other above.");
    }

    const { screen_name: ownerScreenName } = await this.twitter.verifyCredentials({
      $,
    });

    const params = {
      slug: list,
      ownerScreenName,
    };
    if (userId) params.userId = userId;
    if (screenName) params.screenName = screenName;

    const res = await this.twitter.addUserToList({
      $,
      ...params,
    });

    $.export("$summary", "User successfully added to the list");
    return res;
  },
};
