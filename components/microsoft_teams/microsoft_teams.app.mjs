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
        teamId,
        prevContext,
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
      description: "Select a chat (type to search by participant names)",
      async options({
        prevContext, query,
      }) {
        let path = "/chats?$expand=members";
        path += "&$top=20";

        if (query) {
          path += `&$search="${query}"`;
        }

        const response = prevContext?.nextLink
          ? await this.makeRequest({
            path: prevContext.nextLink,
          })
          : await this.makeRequest({
            path,
          });

        this._userCache = this._userCache || new Map();
        const options = [];

        for (const chat of response.value) {
          let members = chat.members.map((member) => ({
            displayName: member.displayName,
            wasNull: !member.displayName,
            userId: member.userId,
            email: member.email,
          }));

          if (members.some((member) => !member.displayName)) {
            try {
              const messages = await this.makeRequest({
                path: `/chats/${chat.id}/messages?$top=10&$orderby=createdDateTime desc`,
              });

              const nameMap = new Map();
              messages.value.forEach((msg) => {
                if (msg.from?.user?.id && msg.from?.user?.displayName) {
                  nameMap.set(msg.from.user.id, msg.from.user.displayName);
                }
              });

              members = members.map((member) => ({
                ...member,
                displayName: member.displayName || nameMap.get(member.userId) || member.email || "Unknown User",
              }));
            } catch (err) {
              console.error(`Failed to fetch messages for chat ${chat.id}:`, err);
            }
          }

          const memberNames = members.map((member) =>
            member.wasNull
              ? `${member.displayName} (External)`
              : member.displayName);

          options.push({
            label: memberNames.join(", "),
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
      useQuery: true,
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
      description: "Text message, HTML message, or Markdown message (will be converted to HTML)",
      optional: true,
      default: "text",
      options: [
        "text",
        "html",
        "markdown",
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
      method,
      path,
      params = {},
      content,
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
      teamId,
      content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/teams/${teamId}/channels`,
        content,
      });
    },
    async sendChannelMessage({
      teamId,
      channelId,
      content,
    }) {
      return this.makeRequest({
        method: "post",
        path: `/teams/${teamId}/channels/${channelId}/messages`,
        content,
      });
    },
    async sendChatMessage({
      chatId,
      content,
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
      teamId,
      channelId,
    }) {
      return this.makeRequest({
        path: `/teams/${teamId}/channels/${channelId}/messages`,
      });
    },
    async listTeamMembers({ teamId }) {
      return this.makeRequest({
        path: `/teams/${teamId}/members`,
      });
    },
    async listChatMessages({ chatId }) {
      return this.makeRequest({
        path: `/chats/${chatId}/messages?$orderby=createdDateTime%20desc`,
      });
    },
    async listShifts({ teamId }) {
      return this.makeRequest({
        path: `/teams/${teamId}/schedule/shifts`,
      });
    },
  },
};
