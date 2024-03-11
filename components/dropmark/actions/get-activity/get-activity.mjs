import dropmark from "../../dropmark.app.mjs";

export default {
  key: "dropmark-get-activity",
  name: "Get Activity",
  description: "Retrieves a blended feed of newly created collections, items, comments, and reactions. [See the documentation](https://support.dropmark.com/article/96-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dropmark,
    username: {
      propDefinition: [
        dropmark,
        "username",
      ],
    },
    personalKey: {
      propDefinition: [
        dropmark,
        "personalKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dropmark.getActivityFeed({
      username: this.username,
      personalKey: this.personalKey,
    });
    $.export("$summary", "Successfully retrieved activity feed");
    return response;
  },
};
