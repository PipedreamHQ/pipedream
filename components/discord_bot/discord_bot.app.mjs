import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "discord_bot",
  propDefinitions: {
    guild: {
      type: "string",
      label: "Guild",
      description: "Discord Guild where your channel lives",
      async options({ prevContext }) {
        const { after } = prevContext || {};

        const guilds =
          await this.getGuilds({
            params: {
              after,
              limit: 50,
            },
          });

        const options =
          guilds.map((guild) => ({
            label: guild.name,
            value: guild.id,
          }));

        const lastGuildId = utils.getLastValue(options);

        return {
          options,
          context: {
            after: lastGuildId,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User",
      description: "Please select a user",
      async options({
        guildId, prevContext,
      }) {
        const { after } = prevContext || {};

        let members;
        try {
          members =
            await this.getGuildMembers({
              guildId,
              params: {
                after,
                limit: 20,
              },
            });
        } catch (e) {
          throw new ConfigurationError(`${e}: ${JSON.stringify(e.response.data)}`);
        }

        const options = members.reduce((reduction, member) => {
          if (member.user.bot) {
            return reduction;
          }

          const option = {
            label: member.user.username,
            value: member.user.id,
          };

          return [
            ...reduction,
            option,
          ];
        }, []);

        const lastUserId = utils.getLastValue(options);

        return {
          options,
          context: {
            after: lastUserId,
          },
        };
      },
    },
    roleId: {
      type: "string",
      label: "Role",
      description: "Please select the role you want to add to the user",
      async options({
        guildId, userId, isAddRole = true,
      }) {
        const allRoles = await this.getGuildRoles({
          guildId,
        });
        const roles = allRoles.filter((role) => !role.managed && !role.name.startsWith("@"));

        let filter;
        // If guild member cannot be retrieved, return all guild roles
        try {
          const member = await this.getGuildMember({
            guildId,
            userId,
          });
          filter = isAddRole
            ? roles.filter((role) => !member.roles.includes(role.id))
            : roles.filter((role) => member.roles.includes(role.id));
        } catch {
          filter = roles;
        }

        return filter?.length > 0
          ? filter.map((role) => ({
            label: role.name,
            value: role.id,
          }))
          : [];
      },
    },
    channelId: {
      type: "string",
      label: "Channel",
      description: "Please select a channel",
      async options({
        guildId, notAllowedChannels,
      }) {
        let channels;
        try {
          channels = await this.getChannels({
            guildId,
          });
        } catch (e) {
          throw new ConfigurationError(`${e}: ${JSON.stringify(e.response.data)}`);
        }
        return utils.getChannelOptions({
          channels,
          notAllowedChannels,
        });
      },
    },
    channelName: {
      type: "string",
      label: "Channel's name",
      description: "There is a 1-100 character channel name restriction",
      default: "my-channel-name",
    },
    channelPosition: {
      type: "integer",
      label: "Position",
      description: "The position of the channel in the left-hand listing",
      optional: true,
    },
    channelTopic: {
      type: "string",
      label: "Topic",
      description: "0-1024 character channel topic",
      optional: true,
    },
    channelNsfw: {
      type: "boolean",
      label: "NSFW",
      description: "[Not Safe For Wumpus](https://support.discord.com/hc/en-us/articles/115000084051-NSFW-Channels-and-Content)",
      optional: true,
    },
    channelBitrate: {
      type: "integer",
      label: "Bitrate",
      description: "The bitrate (in bits) of the voice channel; 8000 to 96000 (128000 for VIP servers).",
      optional: true,
    },
    channelRateLimitPerUser: {
      type: "integer",
      label: "Rate limit per user",
      description: "Amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission manage_messages or manage_channel, are unaffected.",
      optional: true,
    },
    channelUserLimit: {
      type: "integer",
      label: "User limit",
      description: "The user limit of the voice channel; 0 refers to no limit, 1 to 99 refers to a user limit.",
      optional: true,
    },
    channelParentId: {
      type: "string",
      label: "Category",
      description: "Id of the new parent category for a channel",
      optional: true,
      async options({ guildId }) {
        try {
          const channels = await this.getGuildChannels({
            guildId,
          });
          return utils.getCategoryChannelOptions(channels);
        } catch (e) {
          throw new ConfigurationError(`${e}: ${JSON.stringify(e.response.data)}`);
        }
      },
    },
    channelRolePermissions: {
      type: "string[]",
      label: "Roles to add",
      description: "Choose the roles you want to add to your channel",
      optional: true,
      async options({ guildId }) {
        try {
          const roles = await this.getGuildRoles({
            guildId,
          });
          return utils.getRolePermissionOptions(roles);
        } catch (e) {
          throw new ConfigurationError(`${e}: ${JSON.stringify(e.response.data)}`);
        }
      },
    },
    channelMemberPermissions: {
      type: "string[]",
      label: "Members to add",
      description: "Choose the members you want to add to your channel",
      optional: true,
      async options({
        guildId, prevContext,
      }) {
        const { after } = prevContext || {};
        let responses;
        try {
          responses = await Promise.all([
            this.getGuild({
              guildId,
            }),
            this.getGuildRoles({
              guildId,
            }),
            this.getGuildMembers({
              guildId,
              params: {
                after,
                limit: 100,
              },
            }),
          ]);
        } catch (e) {
          throw new ConfigurationError(`${e}: ${JSON.stringify(e.response.data)}`);
        }

        const [
          ,, members,
        ] = responses;

        const lastMemberId = utils.getLastId(members);
        const options = utils.getMemberPermissionOptions(responses);

        return {
          options,
          context: {
            after: lastMemberId,
          },
        };
      },
    },
    max: {
      type: "integer",
      label: "Max records",
      description: "Max number of records in the whole pagination (eg. `60`)",
      optional: true,
    },
    nick: {
      type: "string",
      label: "Nickname",
      description: "Value to set user's nickname to.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Max number of members to return per page (1-1000)",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The highest user id in the previous page",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Get messages before this message ID",
      optional: true,
    },
    around: {
      type: "string",
      label: "Around",
      description: "Get messages around this message ID",
      optional: true,
    },
    channelMessage: {
      type: "string",
      label: "Message",
      description: "Please select a message from the list",
      async options({
        channelId, prevContext,
      }) {
        const { after } = prevContext || {};

        let messages;
        try {
          messages = await this.getMessages({
            channelId,
            params: {
              limit: 10,
              after,
            },
          });
        }
        catch (e) {
          throw new ConfigurationError(`${e}: ${JSON.stringify(e.response.data)}`);
        }

        const options = utils.getMessageOptions(messages);

        const lastMessageId = utils.getLastValue(options);

        return {
          options,
          context: {
            after: lastMessageId,
          },
        };
      },
    },
    emoji: {
      type: "string",
      label: "Emoji",
      description: "Emoji (eg. 👍). To use custom emoji, you must encode it in the format `name:id` with the emoji name and emoji id.",
    },
    messageId: {
      type: "string",
      label: "Message ID",
      description: "Copy the specific Message ID from your channel (eg. `907292892995932230`)",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Enter a simple message up to 2000 characters. This is the most commonly used field. However, it's optional if you pass embed content.",
    },
    embeds: {
      label: "Embeds",
      description: "Embedded rich content (up to 6000 characters), this should be given as an array, e.g. `[{\"title\": \"Hello, Embed!\",\"description\": \"This is an embedded message.\"}]`. To pass data from another step, enter a reference using double curly brackets (e.g., `{{steps.mydata.$return_value}}`). Tip: Construct the `embeds` array in a Node.js code step, return it, and then pass the return value to this step.",
      type: "any",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Overrides the current username",
      optional: true,
    },
    avatarURL: {
      type: "string",
      label: "Avatar URL",
      description: "If used, it overrides the default avatar",
      optional: true,
    },
    threadID: {
      type: "string",
      label: "Thread ID",
      description: "If provided, the message will be posted to this thread",
      optional: true,
    },
  },
  methods: {
    async _makeRequest(opts) {
      const {
        $,
        path,
        ...otherOpts
      } = opts;

      const authorization = `Bot ${this.$auth.bot_token}`;
      const headers = {
        ...otherOpts.headers,
        authorization,
        "user-agent": "@PipedreamHQ/pipedream v0.1",
      };

      const basePath = "https://discordapp.com/api";
      const url = `${basePath}${path}`;

      const config = {
        ...otherOpts,
        headers,
        url,
        timeout: 10000,
      };

      return await axios($ ?? this, config);
    },
    async getGuildMembers({
      $, guildId, params,
    }) {
      return await this._makeRequest({
        $,
        path: `/guilds/${guildId}/members`,
        params,
      });
    },
    async getGuildMember({
      $, guildId, userId,
    }) {
      return await this._makeRequest({
        $,
        path: `/guilds/${guildId}/members/${userId}`,
      });
    },
    async getGuildRoles({
      $, guildId,
    }) {
      return await this._makeRequest({
        $,
        path: `/guilds/${guildId}/roles`,
      });
    },
    async getGuildChannels({
      $, guildId,
    }) {
      return await this._makeRequest({
        $,
        path: `/guilds/${guildId}/channels`,
      });
    },
    async getChannelInvites({
      $, channelId,
    }) {
      return await this._makeRequest({
        $,
        path: `/channels/${channelId}/invites`,
      });
    },
    async removeGuildMemberRole({
      $, guildId, userId, roleId,
    }) {
      return await this._makeRequest({
        $,
        method: "delete",
        path: `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      });
    },
    async addGuildMemberRole({
      $, guildId, userId, roleId,
    }) {
      return await this._makeRequest({
        $,
        method: "put",
        path: `/guilds/${guildId}/members/${userId}/roles/${roleId}`,
      });
    },
    async getGuild({
      $, guildId,
    }) {
      return await this._makeRequest({
        $,
        path: `/guilds/${guildId}`,
      });
    },
    async getUserReactions({
      $, channelId, messageId, emoji, params,
    }) {
      return await this._makeRequest({
        $,
        path: `/channels/${channelId}/messages/${messageId}/reactions/${emoji}`,
        params,
      });
    },
    async createReaction({
      $, channelId, messageId, emoji,
    }) {
      const path = `/channels/${channelId}/messages/${messageId}/reactions/${emoji}/@me`;
      return await this._makeRequest({
        $,
        method: "put",
        path,
      });
    },
    async getGuilds({
      $, params,
    }) {
      return await this._makeRequest({
        $,
        path: "/users/@me/guilds",
        params,
      });
    },
    async createDm({
      $, recipientId,
    }) {
      return await this._makeRequest({
        $,
        method: "post",
        path: "/users/@me/channels",
        data: {
          recipient_id: recipientId,
        },
      });
    },
    async getChannels({
      $, guildId,
    }) {
      return await this._makeRequest({
        $,
        path: `/guilds/${guildId}/channels`,
      });
    },
    async getMessages({
      $, channelId, params,
    }) {
      return await this._makeRequest({
        $,
        path: `/channels/${channelId}/messages`,
        params,
      });
    },
    async getChannelMessage({
      $, channelId, messageId,
    }) {
      return await this._makeRequest({
        $,
        path: `/channels/${channelId}/messages/${messageId}`,
      });
    },
    async deleteChannelMessage({
      $, channelId, messageId,
    }) {
      return await this._makeRequest({
        $,
        method: "delete",
        path: `/channels/${channelId}/messages/${messageId}`,
      });
    },
    async renameChannel({
      $, channelId, name,
    }) {
      return await this._makeRequest({
        $,
        method: "patch",
        path: `/channels/${channelId}`,
        data: {
          name,
        },
      });
    },
    async createChannelInvite({
      $, channelId, data,
    }) {
      return await this._makeRequest({
        $,
        method: "post",
        path: `/channels/${channelId}/invites`,
        data,
      });
    },
    async createChannel({
      $, guildId, data,
    }) {
      return await this._makeRequest({
        $,
        method: "post",
        path: `/guilds/${guildId}/channels`,
        data,
      });
    },
    changeNickname({
      $, guildId, ...data
    }) {
      return this._makeRequest({
        $,
        method: "patch",
        path: `/guilds/${guildId}/members/@me`,
        data,
      });
    },
    async modifyChannel({
      $, channelId, data,
    }) {
      return await this._makeRequest({
        $,
        method: "patch",
        path: `/channels/${channelId}`,
        data,
      });
    },
    async deleteChannel({
      $, channelId,
    }) {
      return await this._makeRequest({
        $,
        method: "delete",
        path: `/channels/${channelId}`,
      });
    },
    async searchUsers({
      $, guildId, query, limit,
    }) {
      return await this._makeRequest({
        $,
        path: `/guilds/${guildId}/members/search`,
        params: {
          query,
          limit,
        },
      });
    },
    async createMessage({
      $, channelId, data,
    }) {
      return await this._makeRequest({
        $,
        path: `/channels/${channelId}/messages`,
        method: "post",
        data,
      });
    },
  },
};
