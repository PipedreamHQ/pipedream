import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-search",
  name: "Search",
  description:
    "Search Slack messages, files, channels, and users using the Real-Time Search API."
    + " Supports keyword and semantic search across public and private channels."
    + " Use **Get User Details** first to find your user ID for filtering by 'my' messages."
    + " Set `contentTypes` to choose what to search: any combination of `messages` (default), `files`, `channels`, `users`."
    + " Returns a single array; each item has a `content_type` of `message`, `file`, `channel`, or `user`."
    + " Messages include channel context, timestamps, and permalinks;"
    + " files, channels, and users are returned as Slack sends them"
    + " (files include `file_id`, `title`, `file_type`, `author_name`, `date_created`, `permalink`, and extracted `content`;"
    + " channels additionally include `channel_id`, extracted from `permalink` for use with other channel actions)."
    + " `Max Results` applies per content type, so selecting more types can return proportionally more items."
    + ` \`Max Results\` is capped at ${constants.MAX_SEARCH_RESULTS}.`
    + " Paging for a content type stops as soon as a page returns fewer than a full page of it,"
    + " and paging overall stops after a fixed page budget, so a sparse type can come back with fewer than `Max Results`."
    + " User mentions come back in the canonical `<@U123>` form; echo it verbatim to post a real mention."
    + " Display names are returned separately as `mentions`, an array of `{ id, name }` objects,"
    + " omitted when no mention carried a name."
    + " Do NOT splice a name back inline: Slack renders `<@U123|Name>` as literal text, not a mention."
    + " [See the documentation](https://api.slack.com/methods/assistant.search.context)",
  version: "0.2.1",
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
      description: "Which kinds of results to return. Select any combination of `messages`, `files`, `channels`, `users`, e.g. `[\"messages\", \"files\"]`. Default: `messages`.",
      options: [
        "messages",
        "files",
        "channels",
        "users",
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
    const wantChannels = contentTypes.includes("channels");
    const wantUsers = contentTypes.includes("users");
    const messages = [];
    const files = [];
    const channels = [];
    const users = [];
    // Marks a content type done once a page returns less than a full page of
    // it, since that means Slack has no more results of that type — without
    // this, a sparse type (e.g. files) below `Max Results` would keep the
    // whole loop paging through an already-exhausted type until the page
    // budget ran out.
    const exhausted = {};
    let pages = 0;
    let cursor;

    const needsMore = (want, list, type) => want && !exhausted[type] && list.length < maxResults;

    do {
      const response = await this.slack.assistantSearch({
        query: this.query,
        channel_types: this.channelTypes,
        content_types: contentTypes.join(","),
        cursor,
      });

      const newMessages = response.results?.messages || [];
      const newFiles = response.results?.files || [];
      const newChannels = response.results?.channels || [];
      const newUsers = response.results?.users || [];

      if (wantMessages) {
        messages.push(...newMessages);
        exhausted.messages ||= newMessages.length < constants.SEARCH_PAGE_SIZE;
      }
      if (wantFiles) {
        files.push(...newFiles);
        exhausted.files ||= newFiles.length < constants.SEARCH_PAGE_SIZE;
      }
      if (wantChannels) {
        channels.push(...newChannels);
        exhausted.channels ||= newChannels.length < constants.SEARCH_PAGE_SIZE;
      }
      if (wantUsers) {
        users.push(...newUsers);
        exhausted.users ||= newUsers.length < constants.SEARCH_PAGE_SIZE;
      }

      cursor = response.response_metadata?.next_cursor;
      pages++;
    } while (
      cursor
      && pages < constants.MAX_SEARCH_PAGES
      && (needsMore(wantMessages, messages, "messages")
        || needsMore(wantFiles, files, "files")
        || needsMore(wantChannels, channels, "channels")
        || needsMore(wantUsers, users, "users"))
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
      ...channels.slice(0, maxResults).map((channel) => ({
        ...channel,
        channel_id: utils.channelIdFromPermalink(channel.permalink),
        content_type: "channel",
      })),
      ...users.slice(0, maxResults).map((user) => ({
        ...user,
        content_type: "user",
      })),
    ];

    $.export("$summary", `Found ${results.length} result${results.length === 1
      ? ""
      : "s"} for "${this.query}"`);

    return results;
  },
};
