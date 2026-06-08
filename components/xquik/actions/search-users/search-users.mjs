import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-search-users",
  name: "Search Users",
  description:
    "Search public X/Twitter users with Xquik. [See the documentation](https://docs.xquik.com/api-reference/x/search-users)",
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
      propDefinition: [
        xquik,
        "query",
      ],
    },
    cursor: {
      propDefinition: [
        xquik,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.searchUsers({
      $,
      q: this.query,
      cursor: this.cursor,
    });

    const users = response?.users ?? response?.data ?? response?.results ?? [];
    const userCount = Array.isArray(users)
      ? users.length
      : (response?.count ?? 0);

    $.export("$summary", `Found ${userCount} users`);
    return response;
  },
};
