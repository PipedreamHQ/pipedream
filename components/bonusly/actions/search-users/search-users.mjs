// x-pd-ai: optimized
import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-search-users",
  name: "Search Users",
  description:
    "Search users in the authenticated caller's company by name or email."
    + " This is a search, not a full company directory dump — a `Search Term` is"
    + " required and matches on name or email."
    + " [See the documentation](https://docs.bonus.ly/reference/searchusers)",
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
      description: "Text to match against user names or emails, e.g. `jane` or `jane.doe@acme.com`.",
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Maximum number of users to return in this page. Defaults to Bonusly's standard page size if omitted.",
      min: 1,
      max: 100,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Opaque pagination cursor for fetching the next page of results. Use the `next_cursor` value returned in the previous response. Omit to fetch the first page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bonusly.searchUsers({
      $,
      searchTerm: this.searchTerm,
      pageSize: this.pageSize,
      cursor: this.cursor,
    });

    $.export("$summary", `Found ${response.users?.length ?? 0} user(s) matching "${this.searchTerm}"`);
    return response;
  },
};
