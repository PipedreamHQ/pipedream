const { WebClient } = require("@slack/web-api");

module.exports = {
  type: "app",
  app: "slack",
  propDefinitions: {
    publicChannel: {
      type: "string",
      label: "Channel",
      //description: "Select one or more channels or DM conversations to monitor for new messages.",
      async options({ prevContext }) {
        let {
          types,
          cursor,
        } = prevContext;
        if (types == null) {
          const scopes = await this.scopes();
          types = [
            "public_channel",
          ];
        }
        const resp = await this.availableConversations(types.join(), cursor);
        return {
          options: resp.conversations.map((c) => {
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
                label: `${c.name}`,
                value: c.id,
              };
            }
          }),
          context: {
            types,
            cursor: resp.cursor,
            userNames,
          },
        };
      },
    },
    privateChannel: {
      type: "string",
      label: "Channel",
      //description: "Select one or more channels or DM conversations to monitor for new messages.",
      async options({ prevContext }) {
        let {
          types,
          cursor,
        } = prevContext;
        if (types == null) {
          const scopes = await this.scopes();
          types = [
            "private_channel",
          ];
        }
        const resp = await this.availableConversations(types.join(), cursor);
        return {
          options: resp.conversations.map((c) => {
            return {
              label: `${c.name}`,
              value: c.id,
            };
          }),
          context: {
            types,
            cursor: resp.cursor,
            userNames,
          },
        };
      },
    },
    user: {
      type: "string",
      label: "User",
      //description: "Select one or more channels or DM conversations to monitor for new messages.",
      async options({ prevContext }) {
        let {
          types,
          cursor,
          userNames,
        } = prevContext;
        if (types == null) {
          const scopes = await this.scopes();
          types = [
            "im",
          ];
          // TODO use paging
          userNames = {};
          for (const user of (await this.users()).users) {
            userNames[user.id] = user.name;
          }
        }
        const resp = await this.availableConversations(types.join(), cursor);
        return {
          options: resp.conversations.map((c) => {
            return {
              label: `@${userNames[c.user]}`,
              value: c.id,
            };
          }),
          context: {
            types,
            cursor: resp.cursor,
            userNames,
          },
        };
      },
    },
    group: {
      type: "string",
      label: "Group",
      //description: "Select one or more channels or DM conversations to monitor for new messages.",
      async options({ prevContext }) {
        let {
          types,
          cursor,
        } = prevContext;
        if (types == null) {
          const scopes = await this.scopes();
          types = [
            "mpim",
          ];
          // TODO use paging
          userNames = {};
          for (const user of (await this.users()).users) {
            userNames[user.id] = user.name;
          }
        }
        const resp = await this.availableConversations(types.join(), cursor);
        return {
          options: resp.conversations.map((c) => {
            return {
              label: c.purpose.value,
              value: c.id,
            };
          }),
          context: {
            types,
            cursor: resp.cursor,
            userNames,
          },
        };
      },
    },
    conversation: {
      type: "string",
      label: "Channel",
      description: "Select a public or private channel, or a user or group to direct message (DM).",
      async options({ prevContext }) {
        let {
          types,
          cursor,
          userNames,
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
            // TODO use paging
            userNames = {};
            for (const user of (await this.users()).users) {
              userNames[user.id] = user.name;
            }
          }
        }
        const resp = await this.availableConversations(types.join(), cursor);
        return {
          options: resp.conversations.map((c) => {
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
            cursor: resp.cursor,
            userNames,
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
      description: "Text of the message to send (see Slack's [formatting docs](https://api.slack.com/reference/surfaces/formatting)). This field is usually required, unless you're providing only attachments instead. Provide no more than 40,000 characters or risk truncation.",
      //example: "Hello world"
    },
    attachments: {
      type: "string",
      description: "A JSON-based array of structured attachments, presented as a URL-encoded string (e.g., `[{\"pretext\": \"pre-hello\", \"text\": \"text-world\"}]`).",
      //example: "[{\"pretext\": \"pre-hello\", \"text\": \"text-world\"}]",
      optional: true,
    },
    unfurl_links: {
      type: "boolean",
      description: "`TRUE` by default. Pass `FALSE` to disable unfurling of links.",
      //example: "true",
      optional: true,
    },
    unfurl_media: {
      type: "boolean",
      description: "`TRUE` by default. Pass `FALSE` to disable unfurling of media content.",
      //example: "true",
      optional: true,
    },
    parse: {
      type: "string",
      description: "Change how messages are treated. Defaults to none. See below.",
      //example: "full",
      optional: true,
    },
    as_user: {
      type: "boolean",
      label: "Send as User",
      description: "Optionally pass `TRUE` to post the message as the authed user, instead of as a bot. Defaults to `FALSE`.",
      //example: "true",
      default: false,
      optional: true,
    },
    mrkdwn: {
      type: "boolean",
      description: "`TRUE` by default. Pass `FALSE` to disable Slack markup parsing.",
      //example: "false",
      default: true,
      optional: true,
    },
    username: {
      type: "string",
      label: "Bot Username",
      description: "Optionally customize your bot's user name (default is `Pipedream`). Must be used in conjunction with `as_user` set to false, otherwise ignored.",
      //example: "My Bot",
      optional: true,
    },
    blocks: {
      type: "string",
      description: "Enter an array of [structured blocks](https://app.slack.com/block-kit-builder) as a URL-encoded string. E.g., `[{ \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \"This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://pipedream.com|this is a link>\" }}]`\n\n**Tip:** Construct your blocks in a code step, return them as an array, and then pass the return value to this step.",
      optional: true,
    },
    icon_emoji: {
      type: "string",
      label: "Icon (emoji)",
      description: "Optionally provide an emoji to use as the icon for this message. E.g., `:fire:` Overrides `icon_url`.  Must be used in conjunction with `as_user` set to `false`, otherwise ignored.",
      //example: ":chart_with_upwards_trend:",
      optional: true,
    },
    link_names: {
      type: "string",
      description: "Find and link channel names and usernames.",
      //example: "true",
      optional: true,
    },
    reply_broadcast: {
      type: "string",
      description: "Used in conjunction with thread_ts and indicates whether reply should be made visible to everyone in the channel or conversation. Defaults to false.",
      //example: "true",
      optional: true,
    },
    reply_channel: {
      label: "Reply Channel or Conversation ID",
      type: "string",
      description: "Provide the channel or conversation ID for the thread to reply to (e.g., if triggering on new Slack messages, enter `{{event.channel}}`). If the channel does not match the thread timestamp, a new message will be posted to this channel.",
      //example: "1234567890.123456",
      optional: true,
    },
    thread_ts: {
      label: "Thread Timestamp",
      type: "string",
      description: "Provide another message's `ts` value to make this message a reply (e.g., if triggering on new Slack messages, enter `{{event.ts}}`). Avoid using a reply's `ts` value; use its parent instead.",
      //example: "1234567890.123456",
      optional: true,
    },
    icon_url: {
      type: "string",
      label: "Icon (image URL)",
      description: "Optionally provide an image URL to use as the icon for this message. Must be used in conjunction with `as_user` set to `false`, otherwise ignored.",
      //example: "http://lorempixel.com/48/48",
      optional: true,
    },
  },
  methods: {
    mySlackId() {
      return this.$auth.oauth_uid;
    },
    sdk() {
      return new WebClient(this.$auth.oauth_access_token);
    },
    async scopes() {
      const resp = await this.sdk().auth.test();
      if (resp.ok) {
        return resp.response_metadata.scopes;
      } else {
        console.log("Error getting scopes", resp.error);
        throw (resp.error);
      }
    },
    async availableConversations(types, cursor) {
      const params = {
        types,
        cursor,
        limit: 10,
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
  },
};
