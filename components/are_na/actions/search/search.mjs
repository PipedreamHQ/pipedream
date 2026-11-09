import { ConfigurationError } from "@pipedream/platform";
import are_na from "../../are_na.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "are_na-search",
  name: "Perform a Search",
  description: "Search across Are.na blocks, channels, users, and groups. Returns `data` (the matching items) and `meta` (pagination: `current_page`, `next_page`, `has_more_pages`, `total_count`). To get more results, call again with `page` set to `meta.next_page`. Only the first 10,000 results can be paged through; narrow with filters. To find a user, group or channel ID for the ID filters, use **List Users**, **List Groups** or **List Channel Slug Options** instead of searching. Pass **Fields** to keep results small. Example: query `*`, type `Image`, ext `pdf`, sort `created_at_desc`, per 10 returns `{ \"data\": [...10 blocks], \"meta\": { \"current_page\": 1, \"next_page\": 2, \"total_count\": 57 } }`. Premium Only: This endpoint requires a Premium subscription. [See the documentation](https://www.are.na/developers/explore/search/search)",
  version: "0.1.0",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    are_na,
    query: {
      propDefinition: [
        are_na,
        "query",
      ],
    },
    type: {
      type: "string[]",
      label: "Type",
      description: "Filter results by content type. Block subtypes: `Text`, `Image`, `Link`, `Attachment`, `Embed`. Aggregate types: `Block` (all block types), `Channel`, `User`, `Group`. `All` returns everything (default)",
      options: constants.SEARCH_TYPES,
      optional: true,
    },
    scope: {
      type: "string",
      label: "Scope",
      description: "Limit search to a specific context, e.g. `my` for your own content",
      options: constants.SEARCH_SCOPES,
      optional: true,
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "Limit search to a specific user's content. Use the **List Users** action to find a user ID",
      optional: true,
    },
    groupId: {
      type: "integer",
      label: "Group ID",
      description: "Limit search to a specific group's content. Use the **List Groups** action to find a group ID",
      optional: true,
    },
    channelId: {
      type: "integer",
      label: "Channel ID",
      description: "Limit search to a specific channel's content. Use the **List Channel Slug Options** action to find a channel ID",
      optional: true,
    },
    ext: {
      type: "string[]",
      label: "File Extensions",
      description: "Filter by file extension, e.g. `pdf`, `jpg`, `png`, `mp4`. Only applies to Attachment and Image blocks",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata Filter",
      description: "Filter blocks and channels by exact custom metadata key/value pairs, e.g. `{\"status\": \"reviewed\"}`. Different keys are combined with AND. Use an array of values for one key to match any of them (OR), e.g. `{\"status\": [\"reviewed\", \"approved\"]}`. Keys may contain only letters, numbers, and underscores. Up to 10 keys and 20 values per key",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order. Defaults to `score_desc` (relevance). Use `random` with Seed for reproducible random ordering",
      options: constants.SEARCH_SORTS,
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Random seed for reproducible ordering. Only used when Sort is `random`; reuse the same seed while paging",
      optional: true,
    },
    after: {
      type: "string",
      label: "Updated After",
      description: "Only return results updated after this ISO 8601 timestamp, e.g. `2026-01-31T00:00:00Z`. Useful for incremental syncing",
      optional: true,
    },
    fields: {
      propDefinition: [
        are_na,
        "fields",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return. Defaults to 1. Use `meta.next_page` from the previous response to get the next page",
      min: 1,
      default: 1,
      optional: true,
    },
    per: {
      type: "integer",
      label: "Per Page",
      description: "Number of items per page (max 100). Defaults to 24",
      min: 1,
      max: 100,
      default: 24,
      optional: true,
    },
  },
  async run({ $ }) {
    let metadata = this.metadata;
    if (typeof metadata === "string") {
      try {
        metadata = JSON.parse(metadata);
      } catch {
        throw new ConfigurationError("Metadata Filter must be a valid JSON object");
      }
    }

    const response = await this.are_na.search({
      $,
      params: {
        query: this.query,
        type: this.type?.join(","),
        scope: this.scope,
        user_id: this.userId,
        group_id: this.groupId,
        channel_id: this.channelId,
        ext: this.ext?.join(","),
        metadata,
        sort: this.sort,
        seed: this.seed,
        after: this.after,
        page: this.page,
        per: this.per,
      },
    });

    if (response?.data) {
      response.data = this.are_na.pluckFields(response.data, this.fields);
    }

    const count = response?.data?.length ?? 0;
    const total = response?.meta?.total_count;
    $.export("$summary", `Search returned ${count} result${count === 1
      ? ""
      : "s"}${total !== undefined
      ? ` (page ${response.meta.current_page}, ${total} total)`
      : ""}`);
    return response;
  },
};
