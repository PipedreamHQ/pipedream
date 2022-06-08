import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";

export default {
  type: "app",
  app: "microsoft_teams",
  propDefinitions: {
    team: {
      type: "string",
      label: "Team",
      description: "Microsoft Team",
      async options({ prevContext }) {
        const response = prevContext.nextLink
          ? await this.clientApiGetRequest(prevContext.nextLink)
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
          ? await this.clientApiGetRequest(prevContext.nextLink)
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
      description: "Team Chat",
      async options({ prevContext }) {
        const response = prevContext.nextLink
          ? await this.clientApiGetRequest(prevContext.nextLink)
          : await this.listChats();
        const options = response.value.map((chat) => ({
          label: chat.topic ?? chat.id,
          value: chat.id,
        }));
        return {
          options,
          context: {
            nextLink: response["@odata.nextLink"],
          },
        };
      },
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum number of items to return",
      optional: true,
      default: 20,
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
    async authenticatedUserId() {
      const { id } = await this.client()
        .api("/me")
        .get();
      return id;
    },
    async clientApiGetRequest(endpoint) {
      return this.client()
        .api(endpoint)
        .get();
    },
    async listTeams() {
      const id = await this.authenticatedUserId();
      return this.clientApiGetRequest(`/users/${id}/joinedTeams?orderby=createdDateTime%20desc`);
    },
    async listChannels({ teamId }) {
      return this.clientApiGetRequest(`/teams/${teamId}/channels?orderby=createdDateTime%20desc`);
    },
    async listChannelMessages({
      teamId, channelId,
    }) {
      return this.clientApiGetRequest(`/teams/${teamId}/channels/${channelId}/messages/delta?orderby=createdDateTime%20desc`);
    },
    async listTeamMembers({ teamId }) {
      return this.clientApiGetRequest(`/teams/${teamId}/members`);
    },
    async listChats() {
      return this.clientApiGetRequest("/chats?orderby=createdDateTime%20desc");
    },
    async listChatMessages({ chatId }) {
      return this.clientApiGetRequest(`/chats/${chatId}/messages?orderby=createdDateTime%20desc`);
    },
  },
};
