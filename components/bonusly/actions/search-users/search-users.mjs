// x-pd-ai: optimized
import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-search-users",
  name: "Search Users",
  description: "Search users in the authenticated caller's company by name or email. This is a search, not a full company directory dump - a `Search Term` is required and matches on name or email. To list users without a search term, use **List Users In Department**, **List Users In Location**, or **List Top-Level Users** instead. [See the documentation](https://docs.bonus.ly/reference/searchusers)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bonusly,
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Text to match against user names or emails, e.g. `john` or `john.smith@company.com`.",
    },
    pageSize: {
      propDefinition: [
        bonusly,
        "pageSize",
      ],
      description: "Maximum number of users to return in this page. Defaults to Bonusly's standard page size if omitted.",
    },
    cursor: {
      propDefinition: [
        bonusly,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bonusly.searchUsers({
      $,
      searchTerm: this.searchTerm,
      pageSize: this.pageSize,
      cursor: this.cursor,
    });

    const morePages = response.next_cursor
      ? " (more pages available)"
      : "";
    $.export("$summary", `Found ${response.users?.length ?? 0} user(s) matching "${this.searchTerm}"${morePages}`);
    return response;
  },
};
