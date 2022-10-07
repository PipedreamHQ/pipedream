import { WebClient } from "@slack/web-api";

export default {
  type: "app",
  app: "slack",
  propDefinitions: {
    publicChannel: {
      type: "string",
      label: "Channel",
      description: "Select a public channel",
      async options({ prevContext }) {
        const { cursor } = prevContext;
        const types = [
          "public_channel",
        ];
        const resp = await this.availableConversations(types.join(), cursor);
        return {
          options: resp.conversations.map((c) => ({
            label: `${c.name}`,
            value: c.id,
          })),
          context: {
            cursor: resp.cursor,
          },
        };
      },
    },
    privateChannel: {
      type: "string",
      label: "Channel",
      description: "Select a private channel",
      async options({ prevContext }) {
        const { cursor } = prevContext;
        const types = [
          "private_channel",
        ];
        const resp = await this.availableConversations(types.join(), cursor);
        return {
          options: resp.conversations.map((c) => ({
            label: `${c.name}`,
            value: c.id,
          })),
          context: {
            cursor: resp.cursor,
          },
        };
      },
    },
    user: {
      type: "string",
      label: "User",
      description: "Select a user",
      async options({ prevContext }) {
        const types = [
          "im",
        ];
        const [
          userNames,
          conversationsResp,
        ] = await Promise.all([
          prevContext.userNames ?? this.userNames(),
          this.availableConversations(types.join(), prevContext.cursor),
        ]);
        return {
          options: conversationsResp.conversations.map((c) => ({
            label: `@${userNames[c.user]}`,
            value: c.id,
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
    reminder: {
      type: "string",
      label: "Reminder",
      description: "Select a reminder",
      async options({ prevContext }) {
        let { cursor } = prevContext;
        let resp = await this.getRemindersForTeam();
        return {
          options: resp.reminders.map((c) => {
            return {
              label: c.text,
              value: c.id,
            };
          }),
          context: {
            cursor: cursor,
          },
        };
      },
    },
    conversation: {
      type: "string",
      label: "Channel",
      description: "Select a public or private channel, or a user or group",
      async options({ prevContext }) {
        let {
          types,
          cursor,
          userNames: userNamesOrPromise,
        } = prevContext;
        if (types == null) {
          const scopes = await this.scopes();
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
        return {
          options: conversationsResp.conversations.map((c) => {
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
    team: {
      type: "string",
      label: "Team",
      description: "Select a team.",
      async options({ prevContext }) {
        let { cursor } = prevContext;

        const resp = await this.getTeams(cursor);

        return {
          options: resp.teams.map((team) => ({
            label: team.name,
            value: team.id,
          })),

          context: {
            cursor: resp.cursor,
          },
        };
      },
    },
    notificationText: {
      type: "string",
      label: "Notification Text",
      description: "Optionally provide a string for Slack to display as the new message notification (if you do not provide this, notification will be blank).",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text of the message to send (see Slack's [formatting docs](https://api.slack.com/reference/surfaces/formatting)). This field is usually necessary, unless you're providing only attachments instead.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of a single key to set.",
    },
    value: {
      type: "string",
      label: "Value",
      description: "Value to set a single key to.",
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
    team_id: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team.",
    },
    file: {
      type: "string",
      label: "File ID",
      description: "Specify a file by providing its ID.",
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
      optional: true,
    },
    unfurl_media: {
      type: "boolean",
      label: "Unful Media",
      description: "`TRUE` by default. Pass `FALSE` to disable unfurling of media content.",
      optional: true,
    },
    parse: {
      type: "string",
      label: "Parse",
      description: "Change how messages are treated. Defaults to none. See below.",
      optional: true,
    },
    as_user: {
      type: "boolean",
      label: "Send as User",
      description: "Optionally pass `TRUE` to post the message as the authed user, instead of as a bot. Defaults to `FALSE`.",
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
      description: "Messages can only be scheduled up to 120 days in advance, and cannot be scheduled for the past. The datetime format should be a unix timestamp (e.g., `1650507616`, [see here](https://www.epochconverter.com/) for help with this format).",
      type: "integer",
      optional: true,
    },
    username: {
      type: "string",
      label: "Bot Username",
      description: "Optionally customize your bot's user name (default is `Pipedream`). Must be used in conjunction with `as_user` set to false, otherwise ignored.",
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
      description: "Optionally provide an emoji to use as the icon for this message. E.g., `:fire:` Overrides `icon_url`.  Must be used in conjunction with `as_user` set to `false`, otherwise ignored.",
      optional: true,
    },
    content: {
      label: "File Path",
      description: "Full path to the image in `/tmp/` directory or a direct link. E.g. `/tmp/cute_cat.jpg`",
      type: "string",
    },
    link_names: {
      type: "string",
      label: "Link Names",
      description: "Find and link channel names and usernames.",
      optional: true,
    },
    reply_broadcast: {
      type: "string",
      label: "Reply Broadcasts",
      description: "Used in conjunction with thread_ts and indicates whether reply should be made visible to everyone in the channel or conversation. Defaults to false.",
      optional: true,
    },
    reply_channel: {
      label: "Reply Channel or Conversation ID",
      type: "string",
      description: "Provide the channel or conversation ID for the thread to reply to (e.g., if triggering on new Slack messages, enter `{{event.channel}}`). If the channel does not match the thread timestamp, a new message will be posted to this channel.",
      optional: true,
    },
    thread_ts: {
      label: "Thread Timestamp",
      type: "string",
      description: "Provide another message's `ts` value to make this message a reply (e.g., if triggering on new Slack messages, enter `{{event.ts}}`). Avoid using a reply's `ts` value; use its parent instead.",
      optional: true,
    },
    timestamp: {
      label: "Timestamp",
      type: "string",
      description: "Timestamp of the relevant data.",
      optional: true,
    },
    icon_url: {
      type: "string",
      label: "Icon (image URL)",
      description: "Optionally provide an image URL to use as the icon for this message. Must be used in conjunction with `as_user` set to `false`, otherwise ignored.",
      optional: true,
    },
    initial_comment: {
      type: "string",
      label: "Initial Comment",
      description: "The message text introducing the file",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of items to return per page.",
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
      description: "The name of the metadata event",
      optional: true,
    },
    metadata_event_payload: {
      type: "string",
      label: "Metadata Event Payload",
      description: "The payload of the metadata event. Must be a JSON string e.g. `{\"key\": \"value\"}`",
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
    isUsername: {
      type: "boolean",
      label: "Is Username",
      description: "Filters out mentions of the keyword that are not a username",
      default: false,
      optional: true,
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
    mySlackId() {
      return this.$auth.oauth_uid;
    },
    /**
     * Returns a Slack Web Client object authenticated with the user's access
     * token
     */
    sdk() {
      return new WebClient(this.$auth.oauth_access_token);
    },
    /**
     * This method returns the list of OAuth scopes the current authenticated
     * user has
     *
     * @returns the list of scopes
     */
    async scopes() {
      const resp = await this.sdk().auth.test();
      if (resp.ok) {
        return resp.response_metadata.scopes;
      } else {
        console.log("Error getting scopes", resp.error);
        throw (resp.error);
      }
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
      const params = {
        types,
        cursor,
        limit: 200,
        exclude_archived: true,
        user: this.$auth.oauth_uid,
      };
      const resp = await this.sdk().users.conversations(params);
      if (resp.ok) {
        return {
          cursor: resp.response_metadata.next_cursor,
          conversations: resp.channels,
        };
      } else {
        console.log("Error getting conversations", resp.error);
        throw (resp.error);
      }
    },
    /**
     * This method lists reminders created by or for a given user
     *
     * @returns an object containing a list of reminders
     */
    async getRemindersForTeam() {
      const resp = await this.sdk().reminders.list();
      if (resp.ok) {
        return {
          reminders: resp.reminders,
        };
      } else {
        throw (resp.error);
      }
    },
    /**
     * Returns a list of all users in the workspace. This includes
     * deleted/deactivated users.
     *
     * @param {string} [cursor] - a cursor returned by the previous API call,
     * used to paginate through collections of data
     * @returns an object containing a list of users and the cursor for the next
     * page of users
     */
    async users(cursor) {
      const resp = await this.sdk().users.list({
        cursor,
      });
      if (resp.ok) {
        return {
          users: resp.members,
          cursor: resp.response_metadata.next_cursor,
        };
      } else {
        console.log("Error getting users", resp.error);
        throw (resp.error);
      }
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
          users,
          cursor: nextCursor,
        } = await this.users(cursor);
        for (const user of users) {
          userNames[user.id] = user.name;
        }
        cursor = nextCursor;
      } while (cursor);
      return userNames;
    },
    async getTeams(cursor) {
      const resp = await this.sdk().auth.teams.list({
        cursor,
      });

      if (resp.ok) {
        return {
          cursor: resp.response_metadata.next_cursor,
          teams: resp.teams,
        };
      } else {
        console.log("Error getting teams", resp.error);
        throw (resp.error);
      }
    },
  },
};
