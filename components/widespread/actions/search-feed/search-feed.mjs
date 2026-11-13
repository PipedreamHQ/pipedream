import widespread from "../../widespread.app.mjs";

export default {
  key: "widespread-search-feed",
  name: "Search Work Feed",
  description: "Search the unified cross-forge funded-work feed (GitHub, GitLab, Forgejo, NEAR, bounty platforms). Filter by forge or minimum reward in USD.",
  version: "0.0.1",
  type: "action",
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
      description: "Filter to one forge/source",
      optional: true,
      options: ["github", "gitlab", "forgejo", "near", "radicle", "tangled"],
    },
    minUsd: {
      type: "integer",
      label: "Minimum USD",
      description: "Only records with rewards at or above this USD value",
      optional: true,
    },
  },
  async run({ $ }) {
    const feed = await this.widespread.searchFeed({
      forge: this.forge,
      min_usd: this.minUsd,
    });
    $.export("$summary", `Matched ${feed?.total ?? feed?.records?.length ?? 0} feed records`);
    return feed;
  },
};
