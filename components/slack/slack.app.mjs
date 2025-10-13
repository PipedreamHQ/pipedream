import { WebClient } from "@slack/web-api";
import constants from "./common/constants.mjs";
import get from "lodash/get.js";
import retry from "async-retry";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "slack",
  propDefinitions: {
    user: {
      type: "string",
      label: "User",
      description: "Select a user",
      async options({
        prevContext, channelId,
      }) {
        const types = [
          "im",
        ];
        let conversationsResp
          = await this.availableConversations(types.join(), prevContext.cursor, true);
        if (channelId) {
          const { members } = await this.listChannelMembers({
            channel: channelId,
            throwRateLimitError: true,
          });
          conversationsResp.conversations = conversationsResp.conversations
            .filter((c) => members.includes(c.user || c.id));
        }
        const userIds = conversationsResp.conversations.map(({ user }) => user).filter(Boolean);
        const realNames = await this.realNameLookup(userIds);
        return {
          options: conversationsResp.conversations.filter((c) => c.user).map((c) => ({
            label: `${realNames[c.user]}`,
            value: c.user || c.id,
          })),
          context: {
            cursor: conversationsResp.cursor,
          },
        };
      },
    },
    group: {
      type: "string",
      label: "Group",
      description: "Select a group",
      async options({ prevContext }) {
        let { cursor } = prevContext;
        const types = [
          "mpim",
        ];
        const resp = await this.availableConversations(types.join(), cursor, true);
        return {
          options: resp.conversations.map((c) => {
            return {
              label: c.purpose.value,
              value: c.id,
            };
          }),
          context: {
            cursor: resp.cursor,
          },
        };
      },
    },
    userGroup: {
      type: "string",
      label: "User Group",
      description: "The encoded ID of the User Group.",
      async options() {
        const { usergroups } = await this.usergroupsList({
          throwRateLimitError: true,
        });
        return usergroups.map((c) => ({
          label: c.name,
          value: c.id,
        }));
      },
    },
    reminder: {
      type: "string",
      label: "Reminder",
      description: "Select a reminder",
      async options() {
        const { reminders } = await this.remindersList({
          throwRateLimitError: true,
        });
        return reminders.map((c) => ({
          label: c.text,
          value: c.id,
        }));
      },
    },
    conversation: {
      type: "string",
      label: "Channel",
      description: "Select a public or private channel, or a user or group",
      async options({
        prevContext, types,
      }) {
        let { cursor } = prevContext;
        if (prevContext?.types) {
          types = prevContext.types;
        }
        if (types == null) {
          const { response_metadata: { scopes } } = await this.authTest({
            throwRateLimitError: true,
          });
          types = [
            "public_channel",
          ];
          if (scopes.includes("groups:read")) {
            types.push("private_channel");
          }
          if (scopes.includes("mpim:read")) {
            types.push("mpim");
          }
          if (scopes.includes("im:read")) {
            types.push("im");
          }
        }
        const conversationsResp = await this.availableConversations(types.join(), cursor, true);
        let conversations, userIds, userNames, realNames;
        if (types.includes("im")) {
          conversations = conversationsResp.conversations;
          userIds = conversations.map(({ user }) => user).filter(Boolean);
        } else {
          conversations = conversationsResp.conversations.filter((c) => !c.is_im);
        }
        if (types.includes("mpim")) {
          userNames = [
            ...new Set(conversations.filter((c) => c.is_mpim).map((c) => c.purpose.value)
              .map((v) => v.match(/@[\w.-]+/g) || [])
              .flat()
              .map((u) => u.slice(1))),
          ];
        }
        if ((userIds?.length > 0) || (userNames?.length > 0)) {
          // Look up real names for userIds and userNames at the same time to
          // minimize number of API calls.
          realNames = await this.realNameLookup(userIds, userNames);
        }

        return {
          options: conversations.map((c) => {
            if (c.is_im) {
              return {
                label: `Direct messaging with: ${realNames[c.user]}`,
                value: c.id,
              };
            } else if (c.is_mpim) {
              const usernames = c.purpose.value.match(/@[\w.-]+/g) || [];
              const realnames = usernames.map((u) => realNames[u.slice(1)] || u);
              return {
                label: realnames.length
                  ? `Group messaging with: ${realnames.join(", ")}`
                  : c.purpose.value,
                value: c.id,
              };
            } else {
              return {
                label: `${c.is_private
                  ? "Private"
                  : "Public"} channel: ${c.name}`,
                value: c.id,
              };
            }
          }),
          context: {
            types,
            cursor: conversationsResp.cursor,
          },
        };
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "Select the channel's id.",
      async options({
        prevContext,
        types = Object.values(constants.CHANNEL_TYPE),
        channelsFilter = (channel) => channel,
        excludeArchived = true,
      }) {
        const {
          channels,
          response_metadata: { next_cursor: cursor },
        } = await this.conversationsList({
          types: types.join(),
          cursor: prevContext.cursor,
          limit: constants.LIMIT,
          exclude_archived: excludeArchived,
          throwRateLimitError: true,
        });

        let userNames;
        if (types.includes("im")) {
          const userIds = channels.filter(({ is_im }) => is_im).map(({ user }) => user);
          userNames = await this.userNameLookup(userIds);
        }

        const options = channels
          .filter(channelsFilter)
          .map((c) => {
            if (c.is_im) {
              return {
                label: `Direct messaging with: @${userNames[c.user]}`,
                value: c.id,
              };
            } else if (c.is_mpim) {
              return {
                label: c.purpose.value,
                value: c.id,
              };
            } else {
              return {
                label: `${c.is_private
                  ? "Private"
                  : "Public"} channel: ${c.name}`,
                value: c.id,
              };
            }
          });

        return {
          options,
          context: {
            cursor,
          },
        };
      },
    },
    team: {
      type: "string",
      label: "Team",
      description: "Select a team.",
      async options({ prevContext }) {
        const {
          teams,
          response_metadata: { next_cursor: cursor },
        } = await this.authTeamsList({
          cursor: prevContext.cursor,
          limit: constants.LIMIT,
          throwRateLimitError: true,
        });

        return {
          options: teams.map((team) => ({
            label: team.name,
            value: team.id,
          })),

          context: {
            cursor,
          },
        };
      },
    },
    messageTs: {
      type: "string",
      label: "Message Timestamp",
      description: "Timestamp of a message. e.g. `1403051575.000407`.",
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text of the message to send (see Slack's [formatting docs](https://api.slack.com/reference/surfaces/formatting)). This field is usually necessary, unless you're providing only attachments instead.",
    },
    topic: {
      type: "string",
      label: "Topic",
      description: "Text of the new channel topic.",
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "Text of the new channel purpose.",
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search query.",
    },
    file: {
      type: "string",
      label: "File ID",
      description: "Specify a file by providing its ID.",
      async options({
        channel, page,
      }) {
        const { files } = await this.listFiles({
          channel,
          page: page + 1,
          count: constants.LIMIT,
          throwRateLimitError: true,
        });
        return files?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    attachments: {
      type: "string",
      label: "Attachments",
      description: "A JSON-based array of structured attachments, presented as a URL-encoded string (e.g., `[{\"pretext\": \"pre-hello\", \"text\": \"text-world\"}]`).",
      optional: true,
    },
    unfurl_links: {
      type: "boolean",
      label: "Unfurl Links",
      description: "Default to `false`. Pass `true` to enable unfurling of links.",
      default: false,
      optional: true,
    },
    unfurl_media: {
      type: "boolean",
      label: "Unfurl Media",
      description: "Defaults to `false`. Pass `true` to enable unfurling of media content.",
      default: false,
      optional: true,
    },
    parse: {
      type: "string",
      label: "Parse",
      description: "Change how messages are treated. Defaults to none. By default, URLs will be hyperlinked. Set `parse` to `none` to remove the hyperlinks. The behavior of `parse` is different for text formatted with `mrkdwn`. By default, or when `parse` is set to `none`, `mrkdwn` formatting is implemented. To ignore `mrkdwn` formatting, set `parse` to full.",
      optional: true,
    },
    as_user: {
      type: "boolean",
      label: "Send as User",
      description: "Optionally pass `true` to post the message as the authenticated user, instead of as a bot. Defaults to `false`.",
      default: false,
      optional: true,
    },
    mrkdwn: {
      label: "Send text as Slack mrkdwn",
      type: "boolean",
      description: "`true` by default. Pass `false` to disable Slack markup parsing. [See docs here](https://api.slack.com/reference/surfaces/formatting)",
      default: true,
      optional: true,
    },
    post_at: {
      label: "Schedule message",
      description: "Messages can only be scheduled up to 120 days in advance, and cannot be scheduled for the past. The datetime should be in ISO 8601 format. (Example: `2014-01-01T00:00:00Z`)",
      type: "string",
      optional: true,
    },
    username: {
      type: "string",
      label: "Bot Username",
      description: "Optionally customize your bot's user name (default is `Pipedream`). Must be used in conjunction with `Send as User` set to false, otherwise ignored.",
      optional: true,
    },
    blocks: {
      type: "string",
      label: "Blocks",
      description: "Enter an array of [structured blocks](https://app.slack.com/block-kit-builder) as a URL-encoded string. E.g., `[{ \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \"This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://pipedream.com|this is a link>\" }}]`\n\n**Tip:** Construct your blocks in a code step, return them as an array, and then pass the return value to this step.",
      optional: true,
    },
    icon_emoji: {
      type: "string",
      label: "Icon (emoji)",
      description: "Optionally provide an emoji to use as the icon for this message. E.g., `:fire:` Overrides `icon_url`.  Must be used in conjunction with `Send as User` set to `false`, otherwise ignored.",
      optional: true,
      async options() {
        return await this.getCustomEmojis({
          throwRateLimitError: true,
        });
      },
    },
    content: {
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
      type: "string",
    },
    link_names: {
      type: "boolean",
      label: "Link Names",
      description: "Find and link channel names and usernames.",
      optional: true,
    },
    thread_broadcast: {
      type: "boolean",
      label: "Send Channel Message",
      description: "If `true`, posts in the thread and channel. Used in conjunction with `Message Timestamp` and indicates whether reply should be made visible to everyone in the channel. Defaults to `false`.",
      default: false,
      optional: true,
    },
    reply_channel: {
      label: "Reply Channel or Conversation ID",
      type: "string",
      description: "Provide the channel or conversation ID for the thread to reply to (e.g., if triggering on new Slack messages, enter `{{event.channel}}`). If the channel does not match the thread timestamp, a new message will be posted to this channel.",
      optional: true,
    },
    icon_url: {
      type: "string",
      label: "Icon (image URL)",
      description: "Optionally provide an image URL to use as the icon for this message. Must be used in conjunction with `Send as User` set to `false`, otherwise ignored.",
      optional: true,
    },
    initial_comment: {
      type: "string",
      label: "Initial Comment",
      description: "The message text introducing the file",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "An email address belonging to a user in the workspace",
    },
    metadata_event_type: {
      type: "string",
      label: "Metadata Event Type",
      description: "The name of the metadata event. Example: `task_created`",
      optional: true,
    },
    metadata_event_payload: {
      type: "string",
      label: "Metadata Event Payload",
      description: "The payload of the metadata event. Must be a JSON string. Example: `{ \"id\": \"11223\", \"title\": \"Redesign Homepage\"}`",
      optional: true,
    },
    ignoreMyself: {
      type: "boolean",
      label: "Ignore myself",
      description: "Ignore messages from me",
      default: false,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Keyword to monitor",
    },
    ignoreBot: {
      type: "boolean",
      label: "Ignore Bots",
      description: "Ignore messages from bots",
      default: false,
      optional: true,
    },
    resolveNames: {
      type: "boolean",
      label: "Resolve Names",
      description: "Instead of returning `channel`, `team`, and `user` as IDs, return their human-readable names.",
      default: false,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of results to include in a page. Default: 250",
      default: constants.LIMIT,
      optional: true,
    },
    numPages: {
      type: "integer",
      label: "Number of Pages",
      description: "The number of pages to retrieve. Default: 1",
      default: 1,
      optional: true,
    },
    addToChannel: {
      type: "boolean",
      label: "Add app to channel automatically?",
      description: "If `true`, the app will be added to the specified non-DM channel(s) automatically. If `false`, you must add the app to the channel manually. Defaults to `true`.",
      default: true,
    },
  },
  methods: {
    getChannelLabel(resource) {
      if (resource.user) {
        return `Direct Messaging with: @${resource.user.name}`;
      }

      const {
        is_private: isPrivate,
        name,
      } = resource.channel;

      return `${isPrivate && "Private" || "Public"} channel #${name}`;
    },
    mySlackId() {
      return this.$auth.oauth_uid;
    },
    getToken(opts = {}) {
      // Use bot token if asBot is true and available, otherwise use user token.
      return (opts.asBot && this.$auth.bot_token)
        ? this.$auth.bot_token
        : this.$auth.oauth_access_token;
    },
    async getChannelDisplayName(channel) {
      if (channel.user) {
        try {
          const { profile } = await this.getUserProfile({
            user: channel.user,
          });
          return `@${profile.real_name || profile?.real_name}`;
        } catch {
          return "user";
        }
      } else if (channel.is_mpim) {
        try {
          const { members } = await this.listChannelMembers({
            channel: channel.id,
          });
          const users = await Promise.all(members.map((m) => this.getUserProfile({
            user: m,
          })));
          const realNames = users.map((u) => u.profile?.real_name || u.real_name);
          return `Group Messaging with: ${realNames.join(", ")}`;
        } catch {
          return `Group Messaging with: ${channel.purpose.value}`;
        }
      }
      return `#${channel?.name}`;
    },
    /**
     * Returns a Slack Web Client object authenticated with the user's access
     * token
     */
    sdk(opts = {}) {
      return new WebClient(this.getToken(opts), {
        rejectRateLimitedCalls: true,
        slackApiUrl: this.$auth.base_url,
      });
    },
    async makeRequest({
      method = "", throwRateLimitError = false, asBot, as_user, ...args
    } = {}) {
      const botTokenAvailable = Boolean(this.$auth.bot_token);
      // Passing as_user as false with a v2 user token lacking the deprecated
      // `chat:write:bot` scope results in an error. If as_user is false and a
      // bot token is available, use the bot token and omit as_user. Otherwise,
      // pass as_user through.
      if (as_user === false && botTokenAvailable) {
        asBot = true;
      } else {
        args.as_user = as_user;
      }

      const props = method.split(".");
      const sdk = props.reduce((reduction, prop) =>
        reduction[prop], this.sdk({
        asBot,
      }));

      let response;
      try {
        response = await this._withRetries(() => sdk(args), throwRateLimitError);
      } catch (error) {
        if ([
          "not_in_channel",
          "channel_not_found",
        ].some((errorType) => error.includes(errorType)) && asBot) {
          const followUp = method.startsWith("chat.")
            ? "Ensure the bot is a member of the channel, or set the **Send as User** option to true to act on behalf of the authenticated user."
            : "Ensure the bot is a member of the channel.";
          throw new ConfigurationError(`${error}\n${followUp}`);
        }
        throw error;
      }

      if (!response.ok) {
        throw response.error;
      }
      return response;
    },
    async _withRetries(apiCall, throwRateLimitError = false) {
      const retryOpts = {
        retries: 3,
        minTimeout: 30000,
      };
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (error) {
          const statusCode = get(error, "code");
          if (statusCode === "slack_webapi_rate_limited_error") {
            if (throwRateLimitError) {
              bail(`Rate limit exceeded. ${error}`);
            } else {
              console.log(`Rate limit exceeded. Will retry in ${retryOpts.minTimeout / 1000} seconds`);
              throw error;
            }
          }
          bail(`${error}`);
        }
      }, retryOpts);
    },
    /**
     * Returns a list of channel-like conversations in a workspace. The
     * "channels" returned depend on what the calling token has access to and
     * the directives placed in the types parameter.
     *
     * @param {string} [types] - a comma-separated list of channel types to get.
     * Any combination of: `public_channel`, `private_channel`, `mpim`, `im`
     * @param {string} [cursor] - a cursor returned by the previous API call,
     * used to paginate through collections of data
     * @returns an object containing a list of conversations and the cursor for the next
     * page of conversations
     */
    async availableConversations(types, cursor, throwRateLimitError = false) {
      const {
        channels: conversations,
        response_metadata: { next_cursor: nextCursor },
      } = await this.usersConversations({
        types,
        cursor,
        limit: constants.LIMIT,
        exclude_archived: true,
        throwRateLimitError,
      });
      return {
        cursor: nextCursor,
        conversations,
      };
    },
    async userNameLookup(ids = [], throwRateLimitError = true, args = {}) {
      let cursor;
      const userNames = {};
      do {
        const {
          members: users,
          response_metadata: { next_cursor: nextCursor },
        } = await this.usersList({
          limit: constants.LIMIT,
          cursor,
          throwRateLimitError,
          ...args,
        });

        for (const user of users) {
          if (ids.includes(user.id)) {
            userNames[user.id] = user.name;
          }
        }

        cursor = nextCursor;
      } while (cursor && Object.keys(userNames).length < ids.length);
      return userNames;
    },
    async realNameLookup(ids = [], usernames = [], throwRateLimitError = true, args = {}) {
      let cursor;
      const realNames = {};
      do {
        const {
          members: users,
          response_metadata: { next_cursor: nextCursor },
        } = await this.usersList({
          limit: constants.LIMIT,
          cursor,
          throwRateLimitError,
          ...args,
        });

        for (const user of users) {
          if (ids.includes(user.id)) {
            realNames[user.id] = user.profile.real_name;
          }
          if (usernames.includes(user.name)) {
            realNames[user.name] = user.profile.real_name;
          }
        }

        cursor = nextCursor;
      } while (cursor && Object.keys(realNames).length < (ids.length + usernames.length));
      return realNames;
    },
    async maybeAddAppToChannels(channelIds = []) {
      if (!this.$auth.bot_token) return;
      try {
        const {
          bot_id, user_id,
        } = await this.authTest({
          asBot: true,
        });
        if (!bot_id) {
          console.log("Skipping adding Slack app to channels: bot ID unavailable.");
          return;
        }
        for (const channel of channelIds) {
          try {
            // Note: Trying to add the app to DM or group DM channels results in
            // the error: method_not_supported_for_channel_type
            await this.inviteToConversation({
              channel,
              users: user_id,
            });
          } catch (error) {
            console.log(`Unable to add Slack app to channel ${channel}: ${error}`);
          }
        }
      } catch (error) {
        console.log(`Unable to add Slack app to channels: ${error}`);
      }
    },
    /**
     * Checks authentication & identity.
     * @param {*} args Arguments object
     * @returns Promise
     */
    authTest(args = {}) {
      return this.makeRequest({
        method: "auth.test",
        ...args,
      });
    },
    /**
     * Lists all reminders created by or for a given user.
     * @param {*} args Arguments object
     * @param {string} [args.team_id] Encoded team id, required if org token is passed.
     * E.g. `T1234567890`
     * @returns Promise
     */
    remindersList(args = {}) {
      return this.makeRequest({
        method: "reminders.list",
        ...args,
      });
    },
    /**
     * List all User Groups for a team
     * @param {*} args
     * @returns Promise
     */
    usergroupsList(args = {}) {
      return this.makeRequest({
        method: "usergroups.list",
        ...args,
      });
    },
    authTeamsList(args = {}) {
      args.limit ||= constants.LIMIT;
      return this.makeRequest({
        method: "auth.teams.list",
        ...args,
      });
    },
    /**
     * List conversations the calling user may access.
     * Bot Scopes: `channels:read` `groups:read` `im:read` `mpim:read`
     * @param {UsersConversationsArguments}       args Arguments object
     * @param {string}  [args.cursor] Pagination value e.g. (`dXNlcjpVMDYxTkZUVDI=`)
     * @param {boolean} [args.exclude_archived] Set to `true` to exclude archived channels
     * from the list. Defaults to `false`
     * @param {number}  [args.limit] Pagination value. Defaults to `250`
     * @param {string}  [args.team_id] Encoded team id to list users in,
     * required if org token is used
     * @param {string}  [args.types] Mix and match channel types by providing a
     * comma-separated list of any combination of `public_channel`, `private_channel`, `mpim`, `im`
     * Defaults to `public_channel`. E.g. `im,mpim`
     * @param {string}  [args.user] Browse conversations by a specific
     * user ID's membership. Non-public channels are restricted to those where the calling user
     * shares membership. E.g `W0B2345D`
     * @returns Promise
     */
    usersConversations(args = {}) {
      args.limit ||= constants.LIMIT;
      return this.makeRequest({
        method: "users.conversations",
        user: this.$auth.oauth_uid,
        ...args,
      });
    },
    /**
     * Lists all users in a Slack team.
     * Bot Scopes: `users:read`
     * @param {UsersListArguments}  args Arguments object
     * @param {string}  [args.cursor] Pagination value e.g. (`dXNlcjpVMDYxTkZUVDI=`)
     * @param {boolean} [args.include_locale] Set this to `true` to receive the locale
     * for users. Defaults to `false`
     * @param {number}  [args.limit] The maximum number of items to return. Defaults to `250`
     * @param {string}  [args.team_id] Encoded team id to list users in,
     * required if org token is used
     * @returns Promise
     */
    usersList(args = {}) {
      args.limit ||= constants.LIMIT;
      return this.makeRequest({
        method: "users.list",
        ...args,
      });
    },
    /**
     * Lists all channels in a Slack team.
     * Bot Scopes: `channels:read` `groups:read` `im:read` `mpim:read`
     * @param {ConversationsListArguments} args Arguments object
     * @param {string}  [args.cursor] Pagination value e.g. (`dXNlcjpVMDYxTkZUVDI=`)
     * @param {boolean} [args.exclude_archived] Set to `true` to exclude archived channels
     * from the list. Defaults to `false`
     * @param {number}  [args.limit] pagination value. Defaults to `250`
     * @param {string}  [args.team_id] encoded team id to list users in,
     * required if org token is used
     * @param {string}  [args.types] Mix and match channel types by providing a
     * comma-separated list of any combination of `public_channel`, `private_channel`, `mpim`, `im`
     * Defaults to `public_channel`. E.g. `im,mpim`
     * @returns Promise
     */
    conversationsList(args = {}) {
      args.limit ||= constants.LIMIT;
      return this.makeRequest({
        method: "conversations.list",
        ...args,
      });
    },
    /**
     * Fetches a conversation's history of messages and events.
     * Bot Scopes: `channels:history` `groups:history` `im:history` `mpim:history`
     * @param {ConversationsHistoryArguments} args Arguments object
     * @param {string}  args.channel Conversation ID to fetch history for. E.g. `C1234567890`
     * @param {string}  [args.cursor] Pagination value e.g. (`dXNlcjpVMDYxTkZUVDI=`)
     * @param {boolean} [args.include_all_metadata]
     * @param {boolean} [args.inclusive]
     * @param {string}  [args.latest]
     * @param {number}  [args.limit]
     * @param {string}  [args.oldest]
     * @returns Promise
     */
    conversationsHistory(args = {}) {
      args.limit ||= constants.LIMIT;
      return this.makeRequest({
        method: "conversations.history",
        ...args,
      });
    },
    /**
     * Retrieve information about a conversation.
     * Bot Scopes: `channels:read` `groups:read` `im:read` `mpim:read`
     * @param {ConversationsInfoArguments} args Arguments object
     * @param {string}  args.channel Conversation ID to learn more about. E.g. `C1234567890`
     * @param {boolean} [args.include_locale] Set this to `true` to receive the locale
     * for users. Defaults to `false`
     * @param {boolean} [args.include_num_members] Set to true to include the
     * member count for the specified conversation. Defaults to `false`
     * @returns Promise
     */
    conversationsInfo(args = {}) {
      return this.makeRequest({
        method: "conversations.info",
        ...args,
      });
    },
    /**
     * Retrieve information about a conversation.
     * Bot Scopes: `users:read`
     * @param {UsersInfoArguments}       args arguments object
     * @param {string}  args.user User to get info on. E.g. `W1234567890`
     * @param {boolean} [args.include_locale] Set this to true to receive the locale
     * for this user. Defaults to `false`
     * @returns Promise
     */
    usersInfo(args = {}) {
      return this.makeRequest({
        method: "users.info",
        ...args,
      });
    },
    /**
     * Searches for messages matching a query.
     * User Scopes: `search:read`
     * @param {SearchMessagesArguments} args Arguments object
     * @param {string}  args.query Search query
     * @param {number}  [args.count] Number of items to return per page. Default `250`
     * @param {string}  [args.cursor] Use this when getting results with cursormark
     * pagination. For first call send `*` for subsequent calls, send the value of
     * `next_cursor` returned in the previous call's results
     * @param {boolean} [args.highlight]
     * @param {number}  [args.page]
     * @param {string}  [args.sort]
     * @param {string}  [args.sort_dir]
     * @param {string}  [args.team_id] Encoded team id to search in,
     * required if org token is used. E.g. `T1234567890`
     * @returns Promise
     */
    searchMessages(args = {}) {
      args.count ||= constants.LIMIT;
      return this.makeRequest({
        method: "search.messages",
        ...args,
      });
    },
    assistantSearch(args = {}) {
      args.count ||= constants.LIMIT;
      return this.sdk().apiCall("assistant.search.context", {
        ...args,
      });
    },
    /**
     * Lists reactions made by a user.
     * User Scopes: `reactions:read`
     * Bot Scopes: `reactions:read`
     * @param {ReactionsListArguments} args Arguments object
     * @param {number}  [args.count] Number of items to return per page. Default `100`
     * @param {string}  [args.cursor] Parameter for pagination. Set cursor equal to the
     * `next_cursor` attribute returned by the previous request's response_metadata.
     * This parameter is optional, but pagination is mandatory: the default value simply
     * fetches the first "page" of the collection.
     * @param {boolean} [args.full] If true always return the complete reaction list.
     * @param {number}  [args.limit] The maximum number of items to return.
     * Fewer than the requested number of items may be returned, even if the end of the
     * list hasn't been reached.
     * @param {number}  [args.page] Page number of results to return. Defaults to `1`.
     * @param {string}  [args.team_id] Encoded team id to list reactions in,
     * required if org token is used
     * @param {string}  [args.user] Show reactions made by this user. Defaults to the authed user.
     * @returns Promise
     */
    reactionsList(args = {}) {
      args.limit ||= constants.LIMIT;
      return this.makeRequest({
        method: "reactions.list",
        ...args,
      });
    },
    async getCustomEmojis(args = {}) {
      const resp = await this.sdk().emoji.list({
        include_categories: true,
        limit: constants.LIMIT,
        ...args,
      });

      const emojis = Object.keys(resp.emoji);
      for (const category of resp.categories) {
        emojis.push(...category.emoji_names);
      }
      return emojis;
    },
    listChannelMembers(args = {}) {
      args.limit ||= constants.LIMIT;
      return this.makeRequest({
        method: "conversations.members",
        ...args,
      });
    },
    listFiles(args = {}) {
      args.count ||= constants.LIMIT;
      return this.makeRequest({
        method: "files.list",
        // Use bot token, if available, since the required `files:read` scope
        // is only requested for bot tokens in the Pipedream app.
        asBot: true,
        ...args,
      });
    },
    listGroupMembers(args = {}) {
      args.limit ||= constants.LIMIT;
      return this.makeRequest({
        method: "usergroups.users.list",
        ...args,
      });
    },
    getFileInfo(args = {}) {
      return this.makeRequest({
        method: "files.info",
        // Use bot token, if available, since the required `files:read` scope
        // is only requested for bot tokens in the Pipedream app.
        asBot: true,
        ...args,
      });
    },
    getUserProfile(args = {}) {
      return this.makeRequest({
        method: "users.profile.get",
        ...args,
      });
    },
    getBotInfo(args = {}) {
      return this.makeRequest({
        method: "bots.info",
        ...args,
      });
    },
    getTeamInfo(args = {}) {
      return this.makeRequest({
        method: "team.info",
        ...args,
      });
    },
    getConversationReplies(args = {}) {
      return this.makeRequest({
        method: "conversations.replies",
        ...args,
      });
    },
    addReactions(args = {}) {
      return this.makeRequest({
        method: "reactions.add",
        ...args,
      });
    },
    postChatMessage(args = {}) {
      return this.makeRequest({
        method: "chat.postMessage",
        ...args,
      });
    },
    archiveConversations(args = {}) {
      return this.makeRequest({
        method: "conversations.archive",
        ...args,
      });
    },
    scheduleMessage(args = {}) {
      return this.makeRequest({
        method: "chat.scheduleMessage",
        ...args,
      });
    },
    createConversations(args = {}) {
      return this.makeRequest({
        method: "conversations.create",
        ...args,
      });
    },
    inviteToConversation(args = {}) {
      return this.makeRequest({
        method: "conversations.invite",
        ...args,
      });
    },
    kickUserFromConversation(args = {}) {
      return this.makeRequest({
        method: "conversations.kick",
        ...args,
      });
    },
    addReminders(args = {}) {
      return this.makeRequest({
        method: "reminders.add",
        ...args,
      });
    },
    deleteFiles(args = {}) {
      return this.makeRequest({
        method: "files.delete",
        ...args,
      });
    },
    deleteMessage(args = {}) {
      return this.makeRequest({
        method: "chat.delete",
        ...args,
      });
    },
    lookupUserByEmail(args = {}) {
      return this.makeRequest({
        method: "users.lookupByEmail",
        ...args,
      });
    },
    setChannelDescription(args = {}) {
      return this.makeRequest({
        method: "conversations.setPurpose",
        ...args,
      });
    },
    setChannelTopic(args = {}) {
      return this.makeRequest({
        method: "conversations.setTopic",
        ...args,
      });
    },
    updateProfile(args = {}) {
      return this.makeRequest({
        method: "users.profile.set",
        ...args,
      });
    },
    updateGroupMembers(args = {}) {
      return this.makeRequest({
        method: "usergroups.users.update",
        ...args,
      });
    },
    updateMessage(args = {}) {
      return this.makeRequest({
        method: "chat.update",
        ...args,
      });
    },
    getUploadUrl(args = {}) {
      return this.makeRequest({
        method: "files.getUploadURLExternal",
        ...args,
      });
    },
    completeUpload(args = {}) {
      return this.makeRequest({
        method: "files.completeUploadExternal",
        ...args,
      });
    },
  },
};
