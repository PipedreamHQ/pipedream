// x-pd-ai: optimized
import utils from "../../common/utils.mjs";
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-channels",
  name: "List Channels",
  description:
    "Return a list of channels in a workspace."
    + " Pass `fields` (e.g. `[\"id\",\"name\"]`) to limit the returned properties —"
    + " a full channel object is ~1KB, so a workspace of any real size can return a payload"
    + " large enough to be truncated. Omit `fields` when you need the complete channel objects."
    + " Use `namePrefix` to filter results to channels whose names start with a given string"
    + " (e.g. `dev-`) without a client-side filter loop."
    + " Returns `has_more: true` and `next_cursor` when more channels exist than were"
    + " fetched — when you see that, raise `numPages` (or pass `cursor`) before answering"
    + " any 'how many' or 'list every' question, otherwise your answer is silently incomplete."
    + " [See the documentation](https://api.slack.com/methods/conversations.list)",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    slack,
    channelTypes: {
      type: "string",
      label: "Channel Types",
      description: "The types of channels to list. Select `public` for public channels only, `private` for private channels only, or `all` for both public and private channels.",
      options: [
        {
          label: "Public Channels",
          value: "public_channel",
        },
        {
          label: "Private Channels",
          value: "private_channel",
        },
        {
          label: "All (Public + Private)",
          value: "public_channel,private_channel",
        },
      ],
      default: "public_channel",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description:
        "Channel properties to return, e.g. `id`, `name`, `is_private`, `is_archived`, `num_members`, `topic`, `purpose`, `created`."
        + " Strongly recommended: `[\"id\", \"name\"]` is enough for almost every task and keeps the response small."
        + " Omit ONLY when you genuinely need the full channel objects — the response is then ~1KB per channel and may be truncated.",
      optional: true,
    },
    pageSize: {
      propDefinition: [
        slack,
        "pageSize",
      ],
    },
    numPages: {
      propDefinition: [
        slack,
        "numPages",
      ],
    },
    cursor: {
      propDefinition: [
        slack,
        "cursor",
      ],
    },
    namePrefix: {
      type: "string",
      label: "Name Prefix",
      description: "Return only channels whose names start with this prefix (case-insensitive). Example: `dev-`. When set, ALL pages are fetched regardless of `Number of Pages` so the filter is applied across the full workspace channel list.",
      optional: true,
    },
  },
  async run({ $ }) {
    const allChannels = [];
    const types = Array.isArray(this.channelTypes)
      ? this.channelTypes.join(",")
      : this.channelTypes;
    const params = {
      limit: this.pageSize,
      types,
    };
    if (this.cursor) params.cursor = this.cursor;
    let page = 0;
    let nextCursor;

    do {
      const {
        channels, response_metadata: metadata,
      } = await this.slack.conversationsList(params);
      allChannels.push(...channels);
      nextCursor = metadata?.next_cursor;
      params.cursor = nextCursor;
      page++;
    // When namePrefix is active, fetch ALL pages so the filter can be applied
    // across the full workspace channel list — matching channels may live on
    // any page and would be silently missing if capped at numPages.
    } while (params.cursor && (this.namePrefix || page < this.numPages));

    // Apply namePrefix filter BEFORE field projection so that `name` is always
    // available during the comparison even when the caller omits it from `fields`.
    let filtered = allChannels;
    if (this.namePrefix) {
      const prefix = this.namePrefix.toLowerCase();
      filtered = allChannels.filter((c) => c.name?.toLowerCase().startsWith(prefix));
    }

    // `fields` is ADDITIVE: omitted returns exactly what this action has always
    // returned, so existing workflows are unaffected. Supplied, it plucks per channel —
    // the difference between ~1KB and ~40 bytes per row, which is what decides whether
    // an agent receives the data or a "result too large" file path.
    const channels = utils.projectFields(filtered, this.fields);

    // Truncation must be VISIBLE. numPages defaults to 1, so the previous version
    // silently dropped every channel past the first page and the caller had no way to
    // know the list was partial — a confidently wrong answer to "list every channel".
    const hasMore = Boolean(nextCursor);

    $.export("$summary", `Successfully found ${channels.length} channel${channels.length === 1
      ? ""
      : "s"}${hasMore
      ? " (more available — raise Number of Pages or pass the cursor)"
      : ""}`);

    return {
      channels,
      has_more: hasMore,
      ...(hasMore
        ? {
          next_cursor: nextCursor,
        }
        : {}),
    };
  },
};
