import mastodon from "../../mastodon.app.mjs";
import { SEARCH_TYPE_OPTIONS } from "../../common/constants.mjs";

export default {
  key: "mastodon-perform-search",
  name: "Perform Search",
  description: "Search for content in accounts, statuses or hashtags. [See the docs here](https://docs.joinmastodon.org/methods/search/#v2)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mastodon,
    q: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Specify whether to search for only `accounts`, `hashtags`, `statuses`",
      options: SEARCH_TYPE_OPTIONS,
    },
    resolve: {
      type: "boolean",
      label: "Resolve",
      description: "Attempt WebFinger lookup? Defaults to false.",
      optional: true,
      default: false,
    },
    following: {
      type: "boolean",
      label: "Following",
      description: "Only include accounts that the user is following? Defaults to false.",
      optional: true,
      default: false,
    },
    accountId: {
      type: "string",
      label: "Account ID",
      description: "If provided, will only return statuses authored by this account.",
      optional: true,
    },
    excludeUnreviewed: {
      type: "boolean",
      label: "Exclude Unreviewed",
      description: "Filter out unreviewed tags? Defaults to false. Use true when trying to find trending tags.",
      optional: true,
      default: false,
    },
    max: {
      propDefinition: [
        mastodon,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      q: this.q,
      type: this.type,
      resolve: this.resolve,
      following: this.following,
      exclude_unreviewed: this.excludeUnreviewed,
    };
    if (this.accountId) {
      params.account_id = this.accountId;
    }
    const results = await this.mastodon.paginate(this.mastodon.search, {
      $,
      params,
    }, this.max, this.type);
    $.export("$summary", `Successfully retrieved ${results.length} item(s)`);
    return results;
  },
};
