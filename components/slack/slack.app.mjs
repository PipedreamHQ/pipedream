import { WebClient } from "@slack/web-api";
import constants from "./common/constants.mjs";
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
        let [
          userNames,
          conversationsResp,
        ] = await Promise.all([
          prevContext.userNames ?? this.userNames(),
          this.availableConversations(types.join(), prevContext.cursor),
        ]);
        if (channelId) {
          const { members } = await this.sdk().conversations.members({
            channel: channelId,
          });
          conversationsResp.conversations = conversationsResp.conversations
            .filter((c) => members.includes(c.user || c.id));
        }
        return {
          options: conversationsResp.conversations.map((c) => ({
            label: `@${userNames[c.user]}`,
            value: c.user || c.id,
          })),
          context: {
            userNames,
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
        const resp = await this.availableConversations(types.join(), cursor);
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
        const { usergroups } = await this.usergroupsList();
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
        const { reminders } = await this.remindersList();
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
        let {
          cursor,
          userNames: userNamesOrPromise,
        } = prevContext;
        if (prevContext?.types) {
          types = prevContext.types;
        }
        if (types == null) {
          const { response_metadata: { scopes } } = await this.authTest();
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
            userNamesOrPromise = this.userNames();
          }
        }
        const [
          userNames,
          conversationsResp,
        ] = await Promise.all([
          userNamesOrPromise,
          this.availableConversations(types.join(), cursor),
        ]);
        const conversations = userNames
          ? conversationsResp.conversations
          : conversationsResp.conversations.filter((c) => !c.is_im);
        return {
          options: conversations.map((c) => {
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
          }),
          context: {
            types,
            cursor: conversationsResp.cursor,
            userNames,
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
        const userNames = prevContext.userNames || await this.userNames();
        const {
          channels,
          response_metadata: { next_cursor: cursor },
        } = await this.conversationsList({
          types: types.join(),
          cursor: prevContext.cursor,
          limit: constants.LIMIT,
          exclude_archived: excludeArchived,
        });

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
            userNames,
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
      description: "Timestamp of a message",
      async options({
        channel, prevContext,
      }) {
        if (!channel) {
          throw new ConfigurationError("Provide a Channel ID in order to retrieve Messages.");
        }
        const {
          messages, response_metadata: { next_cursor: cursor },
        } = await this.conversationsHistory({
          channel,
          cursor: prevContext?.cursor,
        });
        return {
          options: messages.map(({
            ts: value, text: label,
          }) => ({
            value,
            label,
          })),
          context: {
            cursor,
          },
        };
      },
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
        const { files } = await this.sdk().files.list({
          channel,
          page: page + 1,
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
      description: "`TRUE` by default. Pass `FALSE` to disable unfurling of links.",
      default: true,
      optional: true,
    },
    unfurl_media: {
      type: "boolean",
      label: "Unfurl Media",
      description: "`TRUE` by default. Pass `FALSE` to disable unfurling of media content.",
      default: true,
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
      description: "Optionally pass `TRUE` to post the message as the authenticated user, instead of as a bot. Defaults to `FALSE`.",
      default: false,
      optional: true,
    },
    mrkdwn: {
      label: "Send text as Slack mrkdwn",
      type: "boolean",
      description: "`TRUE` by default. Pass `FALSE` to disable Slack markup parsing. [See docs here](https://api.slack.com/reference/surfaces/formatting)",
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
        return await this.getCustomEmojis();
      },
    },
    content: {
      label: "File Path",
      description: "Full path to the file in `/tmp/` directory. E.g. `/tmp/cute_cat.jpg`",
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
    getToken() {
      return this.$auth.oauth_access_token;
    },
    /**
     * Returns a Slack Web Client object authenticated with the user's access
     * token
     */
    sdk() {
      return new WebClient(this.getToken());
    },
    async makeRequest({
      method = "", ...args
    } = {}) {
      let response;
      const props = method.split(".");
      const sdk = props.reduce((reduction, prop) =>
        reduction[prop], this.sdk());

      try {
        response = await sdk(args);
      } catch (error) {
        console.log(`Error calling ${method}`, error);
        throw error;
      }

      if (!response.ok) {
        console.log(`Error in response with method ${method}`, response.error);
        throw response.error;
      }
      return response;
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
    async availableConversations(types, cursor) {
      const {
        channels: conversations,
        response_metadata: { next_cursor: nextCursor },
      } = await this.usersConversations({
        types,
        cursor,
        limit: constants.LIMIT,
        exclude_archived: true,
      });
      return {
        cursor: nextCursor,
        conversations,
      };
    },
    /**
     * Returns a mapping from user ID to user name for all users in the workspace
     *
     * @returns the mapping from user ID to user name
     */
    async userNames() {
      let cursor;
      const userNames = {};
      do {
        const {
          members: users,
          response_metadata: { next_cursor: nextCursor },
        } = await this.usersList({
          cursor,
        });

        for (const user of users) {
          userNames[user.id] = user.name;
        }

        cursor = nextCursor;
      } while (cursor);
      return userNames;
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
     * @param {number}  [args.limit] Pagination value. Defaults to `0`
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
     * @param {number}  [args.limit] Pagination value. Defaults to `0`
     * @param {string}  [args.team_id] Encoded team id to list users in,
     * required if org token is used
     * @returns Promise
     */
    usersList(args = {}) {
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
     * @param {number}  [args.limit] pagination value. Defaults to `0`
     * @param {string}  [args.team_id] encoded team id to list users in,
     * required if org token is used
     * @param {string}  [args.types] Mix and match channel types by providing a
     * comma-separated list of any combination of `public_channel`, `private_channel`, `mpim`, `im`
     * Defaults to `public_channel`. E.g. `im,mpim`
     * @returns Promise
     */
    conversationsList(args = {}) {
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
     * @param {number}  [args.count] Number of items to return per page. Default `20`
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
      return this.makeRequest({
        method: "search.messages",
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
      return this.makeRequest({
        method: "reactions.list",
        ...args,
      });
    },
    async getCustomEmojis() {
      const resp = await this.sdk().emoji.list({
        include_categories: true,
      });

      const emojis = Object.keys(resp.emoji);
      for (const category of resp.categories) {
        emojis.push(...category.emoji_names);
      }
      return emojis;
    },
  },
};
