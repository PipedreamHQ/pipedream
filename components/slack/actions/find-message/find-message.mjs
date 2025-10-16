import slack from "../../slack.app.mjs";

export default {
  key: "slack-find-message",
  name: "Find Message",
  description: "Find a Slack message. [See the documentation](https://api.slack.com/methods/assistant.search.context)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    slack,
    query: {
      propDefinition: [
        slack,
        "query",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of messages to return",
      default: 20,
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Return matches sorted by either `score` or `timestamp`",
      options: [
        "score",
        "timestamp",
      ],
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Sort ascending (asc) or descending (desc)`",
      options: [
        "desc",
        "asc",
      ],
      optional: true,
    },
  },
  methods: {
    normalizeAssistantMatch(match) {
      if (!match || typeof match !== "object") {
        return match;
      }
      const {
        author_user_id: authorUserId,
        team_id: teamId,
        channel_id: channelId,
        message_ts: messageTs,
        content,
        permalink,
        is_author_bot: isAuthorBot,
        message,
        channel,
        ...rest
      } = match;
      const baseMessage = typeof message === "object"
        ? message
        : {};
      const channelInfo = channel && typeof channel === "object"
        ? {
          ...channel,
          id: channel.id || channelId,
        }
        : channelId
          ? {
            id: channelId,
          }
          : undefined;
      const normalized = {
        type: "message",
        user: authorUserId,
        team: teamId,
        ts: messageTs,
        text: content,
        permalink,
        channel: channelInfo,
        ...baseMessage,
        ...rest,
      };
      if (isAuthorBot !== undefined && normalized.is_author_bot === undefined) {
        normalized.is_author_bot = isAuthorBot;
      }
      if (normalized.text == null) {
        normalized.text = baseMessage.text || content;
      }
      if (normalized.ts == null) {
        normalized.ts = baseMessage.ts || messageTs;
      }
      if (!normalized.channel && baseMessage.channel) {
        normalized.channel = baseMessage.channel;
      } else if (normalized.channel && baseMessage.channel && typeof baseMessage.channel === "object") {
        normalized.channel = {
          ...normalized.channel,
          ...baseMessage.channel,
        };
      }
      return normalized;
    },
    async searchWithAssistant(baseParams, maxResults) {
      const matches = [];
      let cursor;

      do {
        const response = await this.slack.assistantSearch({
          ...baseParams,
          channel_types: "public_channel,private_channel",
          cursor,
        });
        const messages = (response.results?.messages || [])
          .map((item) => this.normalizeAssistantMatch(item));
        matches.push(...messages);
        cursor = response.response_metadata?.next_cursor;
      } while (cursor && matches.length < maxResults);

      return matches.slice(0, maxResults);
    },
    async searchWithSearchMessages(baseParams, maxResults) {
      const matches = [];
      let page = 1;
      const count = Math.min(Math.max(maxResults, 1), 100);

      while (matches.length < maxResults) {
        const response = await this.slack.searchMessages({
          ...baseParams,
          count,
          page,
        });
        const pageMatches = response.messages?.matches || [];
        matches.push(...pageMatches);

        if (matches.length >= maxResults) {
          break;
        }

        const pagination = response.messages?.pagination;
        const paging = response.messages?.paging;
        const hasMore = pagination
          ? pagination.page < pagination.page_count
          : paging
            ? paging.page < paging.pages
            : false;

        if (!hasMore) {
          break;
        }

        page += 1;
      }

      return matches.slice(0, maxResults);
    },
    shouldFallbackToSearchMessages(error) {
      const errorCode = typeof error === "string"
        ? error
        : error?.data?.error || error?.message;

      if (!errorCode?.includes("missing_scope")) {
        return false;
      }

      const providedSources = [
        error?.data?.provided,
        error?.provided,
        error?.original?.data?.provided,
      ].filter(Boolean);

      const providedScopes = providedSources
        .flatMap((value) => Array.isArray(value)
          ? value
          : String(value).split(","))
        .map((scope) => scope.trim())
        .filter(Boolean);

      return providedScopes.includes("search:read");
    },
  },
  async run({ $ }) {
    const maxResults = Math.max(this.maxResults ?? 20, 1);
    const baseParams = {
      query: this.query,
      sort: this.sort,
      sort_dir: this.sortDirection,
    };
    let matches;

    try {
      matches = await this.searchWithAssistant(baseParams, maxResults);
    } catch (error) {
      if (this.shouldFallbackToSearchMessages(error)) {
        matches = await this.searchWithSearchMessages(baseParams, maxResults);
      } else {
        throw error;
      }
    }

    $.export("$summary", `Found ${matches.length} matching message${matches.length === 1
      ? ""
      : "s"}`);

    return matches;
  },
};
