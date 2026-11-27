import donethat from "../../donethat.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "donethat-search-work",
  name: "Search Work",
  description: "Search the tasks and activity DoneThat recorded over the last 1 to 30 days for a word or phrase."
    + " Use it to answer \"when did I work on X\" or to find the task behind a topic; use **Get Time Report** for totals over a date range."
    + " Results are ranked by match quality, then newest first, and include a `snippet`; task results carry `metadata.minutes` and `metadata.projectId`."
    + " Matching is lexical, so use words that appear in task titles or descriptions."
    + " [See the documentation](https://donethat.ai/api-reference/search)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    donethat,
    query: {
      type: "string",
      label: "Query",
      description: "The search phrase, max 100 characters, e.g. `customer onboarding`.",
    },
    context: {
      type: "string",
      label: "Context",
      description: "An optional ranking hint, max 100 characters, e.g. `enterprise pilot`. It reorders matches but does not broaden them.",
      optional: true,
    },
    days: {
      type: "integer",
      label: "Days",
      description: "How many days back to search, from `1` to `30`, e.g. `14`. Defaults to `7`.",
      min: 1,
      max: 30,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return, from `1` to `50`, e.g. `20`. Defaults to `20`.",
      min: 1,
      max: 50,
      optional: true,
    },
    sources: {
      type: "string[]",
      label: "Sources",
      description: "What to search: `tasks`, `activity` or both, e.g. `[\"tasks\"]`. Defaults to both.",
      options: constants.SEARCH_SOURCES,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.donethat.searchWork({
      $,
      data: {
        query: this.query,
        context: this.context,
        days: this.days,
        limit: this.limit,
        sources: this.sources?.length
          ? this.sources
          : undefined,
      },
    });

    const count = response.results?.length ?? 0;
    $.export("$summary", `Found ${count} result${count === 1
      ? ""
      : "s"} for "${this.query}"`);
    return response;
  },
};
