import bonusly from "../../bonusly.app.mjs";

export default {
  key: "bonusly-list-locations",
  name: "List Locations",
  description: "List the distinct locations configured for users in the authenticated caller's company, with a user count for each. Call this first to discover the exact location names accepted by **List Users In Location**, which matches exactly and returns nothing for a misspelled or differently-cased name. [See the documentation](https://docs.bonus.ly/reference/listlocations)",
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
      description: "Narrow the results to locations whose name starts with this text, e.g. `Ber` matches `Berlin`. This is a prefix match, so it will not match text in the middle of a name. Omit to return every location.",
    },
    pageSize: {
      propDefinition: [
        bonusly,
        "pageSize",
      ],
      description: "Maximum number of locations to return in this page. Defaults to Bonusly's standard page size if omitted.",
    },
    cursor: {
      propDefinition: [
        bonusly,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bonusly.listLocations({
      $,
      search: this.search,
      pageSize: this.pageSize,
      cursor: this.cursor,
    });

    const morePages = response.next_cursor
      ? " (more pages available)"
      : "";
    $.export("$summary", `Found ${response.locations?.length ?? 0} location(s)${morePages}`);
    return response;
  },
};
