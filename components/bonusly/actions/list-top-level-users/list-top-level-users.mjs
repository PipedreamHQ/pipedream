import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-list-top-level-users",
  name: "List Top-Level Users",
  description: "List the users in the authenticated caller's company who have no manager - the roots of the org chart, typically executives. Use this to answer who sits at the top of the company, or as a starting point when you have no other identifier to work from. Takes no required input. [See the documentation](https://docs.bonus.ly/reference/listtoplevelusers)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    bonusly,
    search: {
      propDefinition: [
        bonusly,
        "search",
      ],
      description: "Narrow the results by matching this text against user names or emails, e.g. `john` or `john.smith@company.com`. Omit to return every top-level user.",
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
    const response = await this.bonusly.listTopLevelUsers({
      $,
      search: this.search,
      pageSize: this.pageSize,
      cursor: this.cursor,
    });

    const morePages = response.next_cursor
      ? " (more pages available)"
      : "";
    $.export("$summary", `Found ${response.users?.length ?? 0} top-level user(s)${morePages}`);
    return response;
  },
};
