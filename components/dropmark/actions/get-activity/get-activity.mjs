import dropmark from "../../dropmark.app.mjs";

export default {
  key: "dropmark-get-activity",
  name: "Get Activity",
  description: "Retrieves a blended feed of newly created collections, items, comments, and reactions. [See the documentation](https://support.dropmark.com/article/96-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dropmark,
  },
  async run({ $ }) {
    const response = await this.dropmark.getActivityFeed({
      $,
    });
    $.export("$summary", "Successfully retrieved activity feed");
    return response;
  },
};
