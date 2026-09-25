import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-search",
  name: "Search",
  description:
    "Search Slack messages and files using the Real-Time Search API."
    + " Supports keyword and semantic search across public and private channels."
    + " Use **Get User Details** first to find your user ID for filtering by 'my' messages."
    + " Set `contentTypes` to choose what to search: `messages` (default), `files`, or both."
    + " Returns a single array; each item has a `content_type` of `message` or `file`."
    + " Messages include channel context, timestamps, and permalinks;"
    + " files include `file_id`, `title`, `file_type`, `author_name`, `date_created`, `permalink`, and extracted `content`."
    + " `Max Results` applies per content type, so searching both can return up to twice that many items."
    + ` \`Max Results\` is capped at ${constants.MAX_SEARCH_RESULTS}.`
    + " Paging stops after a fixed page budget, so a sparse type can come back with fewer than `Max Results`."
    + " User mentions come back in the canonical `<@U123>` form; echo it verbatim to post a real mention."
    + " Display names are returned separately as `mentions`, an array of `{ id, name }` objects,"
    + " omitted when no mention carried a name."
    + " Do NOT splice a name back inline: Slack renders `<@U123|Name>` as literal text, not a mention."
    + " [See the documentation](https://api.slack.com/methods/assistant.search.context)",
  version: "0.2.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack,
    query: {
      type: "string",
      label: "Query",
      description: "The search query. Supports Slack search syntax — e.g. `from:@user`, `in:#channel`, `before:2025-01-01`.",
    },
    channelTypes: {
      type: "string",
      label: "Channel Types",
      description: "Comma-separated channel types to search. Default: `public_channel,private_channel`.",
      default: "public_channel,private_channel",
      optional: true,
    },
    contentTypes: {
      type: "string[]",
      label: "Content Types",
      description: "Which kinds of results to return. Select `messages`, `files`, or both, e.g. `[\"messages\", \"files\"]`. Default: `messages`.",
      options: [
        "messages",
        "files",
      ],
      default: [
        "messages",
      ],
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of results to return per content type, up to ${constants.MAX_SEARCH_RESULTS}, e.g. \`20\`.`,
      default: 20,
      min: 1,
      max: constants.MAX_SEARCH_RESULTS,
      optional: true,
    },
  },
  async run({ $ }) {
    const maxResults = Math.max(this.limit ?? 20, 1);
    if (maxResults > constants.MAX_SEARCH_RESULTS) {
      throw new ConfigurationError(`\`Max Results\` must be ${constants.MAX_SEARCH_RESULTS} or less.`);
    }
    const contentTypes = this.contentTypes?.length
      ? this.contentTypes
      : [
        "messages",
      ];
    const wantMessages = contentTypes.includes("messages");
    const wantFiles = contentTypes.includes("files");
    const messages = [];
    const files = [];
    let pages = 0;
    let cursor;

    do {
      const response = await this.slack.assistantSearch({
        query: this.query,
        channel_types: this.channelTypes,
        content_types: contentTypes.join(","),
        cursor,
      });
      if (wantMessages) {
        messages.push(...(response.results?.messages || []));
      }
      if (wantFiles) {
        files.push(...(response.results?.files || []));
      }
      cursor = response.response_metadata?.next_cursor;
      pages++;
    } while (
      cursor
      && pages < constants.MAX_SEARCH_PAGES
      && ((wantMessages && messages.length < maxResults)
        || (wantFiles && files.length < maxResults))
    );

    const results = [
      ...utils.normalizeSearchMessages(messages.slice(0, maxResults))
        .map((message) => ({
          ...message,
          content_type: "message",
        })),
      ...files.slice(0, maxResults).map((file) => ({
        ...file,
        content_type: "file",
      })),
    ];

    $.export("$summary", `Found ${results.length} result${results.length === 1
      ? ""
      : "s"} for "${this.query}"`);

    return results;
  },
};
