import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-search-users",
  name: "Search Users",
  description:
    "Search public X/Twitter users with Xquik. [See the documentation](https://docs.xquik.com/api-reference/overview)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    xquik,
    query: {
      propDefinition: [xquik, "query"],
      description: "User search query.",
    },
    cursor: {
      propDefinition: [xquik, "cursor"],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.searchUsers({
      $,
      q: this.query,
      cursor: this.cursor,
    });

    $.export("$summary", "Successfully searched users");
    return response;
  },
};
