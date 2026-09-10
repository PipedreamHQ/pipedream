import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-list-users-in-location",
  name: "List Users In Location",
  description: "List the users in the authenticated caller's company who belong to a specific location. Use this to enumerate a location's roster - unlike **Search Users**, no search term is required, so it returns everyone based at the location. [See the documentation](https://docs.bonus.ly/reference/listusersinlocation)",
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
    location: {
      type: "string",
      label: "Location",
      description: "The location to list users for, e.g. `Berlin`. This is an exact match - a partial or differently-cased name returns no users. Use **List Locations** to find the exact names configured for your company.",
    },
    search: {
      propDefinition: [
        bonusly,
        "search",
      ],
      description: "Narrow the location's roster by matching this text against user names or emails, e.g. `john` or `john.smith@company.com`. Omit to return every user at the location.",
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
    const response = await this.bonusly.listUsersInLocation({
      $,
      location: this.location,
      search: this.search,
      pageSize: this.pageSize,
      cursor: this.cursor,
    });

    const morePages = response.next_cursor
      ? " (more pages available)"
      : "";
    $.export("$summary", `Found ${response.users?.length ?? 0} user(s) in location "${this.location}"${morePages}`);
    return response;
  },
};
