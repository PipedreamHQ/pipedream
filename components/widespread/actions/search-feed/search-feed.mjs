import widespread from "../../widespread.app.mjs";

export default {
  key: "widespread-search-feed",
  name: "Search Work Feed",
  description: "Search the unified cross-forge funded-work feed (GitHub, GitLab, Forgejo, NEAR, bounty platforms). Filter by forge or minimum reward in USD. [See docs](https://widespread-bridge.widespread.workers.dev/llms.txt)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    widespread,
    forge: {
      type: "string",
      label: "Forge",
      description: "Filter to one forge/source (e.g. `github`)",
      optional: true,
      options: ["github", "gitlab", "forgejo", "near", "radicle", "tangled"],
    },
    minUsd: {
      type: "integer",
      label: "Minimum USD",
      description: "Only records with rewards at or above this USD value (e.g. `50`)",
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor from a previous response's `next_cursor` — returns the next page of feed records",
      optional: true,
    },
  },
  async run({ $ }) {
    const feed = await this.widespread.searchFeed($, {
      forge: this.forge,
      min_usd: this.minUsd,
      cursor: this.cursor,
    });
    $.export("$summary", `Matched ${feed?.total ?? feed?.records?.length ?? 0} feed records`);
    return feed;
  },
};
