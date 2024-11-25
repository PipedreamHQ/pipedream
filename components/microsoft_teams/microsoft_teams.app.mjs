import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "microsoft_teams",
  description: "**Personal accounts are not currently supported by Microsoft Teams.** Refer to Microsoft's documentation [here](https://learn.microsoft.com/en-us/graph/permissions-reference#remarks-7) to learn more.",
  propDefinitions: {
    team: {
      type: "string",
      label: "Team",
      description: "Microsoft Team",
      async options({ prevContext }) {
        const response = prevContext.nextLink
          ? await this.makeRequest({
            path: prevContext.nextLink,
          })
          : await this.listTeams();
        const options = response.value.map((team) => ({
          label: team.displayName,
          value: team.id,
        }));
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "Team Channel",
      async options({
        teamId, prevContext,
      }) {
        const response = prevContext.nextLink
          ? await this.makeRequest({
            path: prevContext.nextLink,
          })
          : await this.listChannels({
            teamId,
          });
        const options = response.value.map((channel) => ({
          label: channel.displayName,
          value: channel.id,
        }));
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    chat: {
      type: "string",
      label: "Chat",
      description: "Team Chat (internal and external contacts)",
      async options({ prevContext }) {
        const response = prevContext.nextLink
          ? await this.makeRequest({
            path: prevContext.nextLink,
          })
          : await this.listChats();

        const myTenantId = await this.getAuthenticatedUserTenant();
        const options = [];

        this._userCache = this._userCache || new Map();

        for (const chat of response.value) {
          const messages = await this.makeRequest({
            path: `/chats/${chat.id}/messages?$top=50`,
          });

          const members = await Promise.all(chat.members.map(async (member) => {
            const cacheKey = `user_${member.userId}`;
            let displayName = member.displayName || this._userCache.get(cacheKey);

            if (!displayName) {
              try {
                if (messages?.value?.length > 0) {
                  const userMessage = messages.value.find((msg) =>
                    msg.from?.user?.id === member.userId);
                  if (userMessage?.from?.user?.displayName) {
                    displayName = userMessage.from.user.displayName;
                  }
                }

                if (!displayName) {
                  const userDetails = await this.makeRequest({
                    path: `/users/${member.userId}`,
                  });
                  displayName = userDetails.displayName;
                }

                this._userCache.set(cacheKey, displayName);
              } catch (err) {
                if (err.statusCode === 404) {
                  displayName = "User Not Found";
                } else if (err.statusCode === 403) {
                  displayName = "Access Denied";
                } else {
                  displayName = "Unknown User";
                }
                console.error(`Failed to fetch user details for ${member.userId}:`, err);
              }
            }

            const isExternal = member.tenantId !== myTenantId || !member.tenantId;
            return isExternal
              ? `${displayName} (External)`
              : displayName;
          }));

          options.push({
            label: members.join(", "),
            value: chat.id,
          });
        }
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    channelDisplayName: {
      type: "string",
      label: "Display Name",
      description: "Display name of the channel",
    },
    channelDescription: {
      type: "string",
      label: "Description",
      description: "Description of the channel",
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message to be sent",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "Text message or HTML message",
      optional: true,
      default: "text",
      options: [
        "text",
        "html",
      ],
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    client() {
      return new Client.initWithMiddleware({
        authProvider: {
          getAccessToken: () => Promise.resolve(this._accessToken()),
        },
      });
    },
    async makeRequest({
      method, path, params = {}, content,
    }) {
      const api = this.client().api(path);

      const builtParams = {
        ...params,
        [method || constants.DEFAULT_METHOD]: content,
      };
      return Object.entries(builtParams)
        .reduce((reduction, param) => {
          const [
            methodName,
            args,
          ] = param;
          const methodArgs = Array.isArray(args)
            ? args
            : [
              args,
            ];
          return methodName
            ? reduction[methodName](...methodArgs)
            : reduction;
        }, api);
    },
    async getAuthenticatedUserTenant() {
      try {
        const { value } = await this.client()
          .api("/organization")
          .get();

        if (!value || value.length === 0) {
          throw new Error("No organization found");
        }

        return value[0].id;
      } catch (error) {
        console.error("Failed to fetch tenant ID:", error);
        throw new Error("Unable to determine tenant ID");
      }
    },
    async authenticatedUserId() {
      const { id } = await this.client()
        .api("/me")
        .get();
      return id;
    },
    async listTeams() {
      const id = await this.authenticatedUserId();
      return this.makeRequest({
        path: `/users/${id}/joinedTeams`,
      });
    },
    async listChannels({ teamId }) {
      return this.makeRequest({
        path: `/teams/${teamId}/channels`,
      });
    },
    async listChats() {
      return this.makeRequest({
        path: "/chats?$expand=members",
      });
    },
    async createChannel({
      teamId, content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/teams/${teamId}/channels`,
        content,
      });
    },
    async sendChannelMessage({
      teamId, channelId, content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/teams/${teamId}/channels/${channelId}/messages`,
        content,
      });
    },
    async sendChatMessage({
      chatId, content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/chats/${chatId}/messages`,
        content,
      });
    },
    async *paginate(fn, params) {
      let nextLink;
      do {
        const response = nextLink
          ? await this.makeRequest({
            path: nextLink,
          })
          : await fn(params);

        for (const value of response.value) {
          yield value;
        }

        nextLink = response["@odata.nextLink"];
      } while (nextLink);
    },
    async clientApiGetRequest(endpoint) {
      return this.client()
        .api(endpoint)
        .get();
    },
    async listChannelMessages({
      teamId, channelId,
    }) {
      return this.makeRequest({
        path: `/teams/${teamId}/channels/${channelId}/messages/delta`,
      });
    },
    async listTeamMembers({ teamId }) {
      return this.makeRequest({
        path: `/teams/${teamId}/members`,
      });
    },
    async listChatMessages({ chatId }) {
      return this.makeRequest({
        path: `/chats/${chatId}/messages`,
      });
    },
    async listShifts({ teamId }) {
      return this.makeRequest({
        path: `/teams/${teamId}/schedule/shifts`,
      });
    },
  },
};
