import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  HttpRequestParams,
  PostMessageParams, PostMessageResponse, Team,
} from "../common/types";
import { Channel } from "../common/types";

export default defineApp({
  type: "app",
  app: "mattermost",
  propDefinitions: {
    channelId: {
      label: "Channel",
      description: "The channel to post in.",
      type: "string",
      async options() {
        const channels: Channel[] = await this.listChannels();

        return channels.map(({
          id, name, display_name,
        }) => {
          const label = name && display_name && (name !== display_name)
            ? `${display_name} (${name})`
            : (display_name || name);

          return {
            label,
            value: id,
          };
        });
      },
    },
    publicChannelId: {
      label: "Channel",
      description: "A public channel on this team to emit events for.",
      type: "string",
      async options({ teamId }) {
        const channels: Channel[] = await this.listTeamChannels(teamId);

        return channels.map(({
          id, name, display_name,
        }) => {
          const label = name && display_name && (name !== display_name)
            ? `${display_name} (${name})`
            : (display_name || name);

          return {
            label,
            value: id,
          };
        });
      },
    },
    teamId: {
      label: "Team",
      description: "The ID of the team that events will be emitted for.",
      type: "string",
      async options() {
        const teams: Team[] = await this.listTeams();

        return teams.map(({
          id, name, display_name,
        }) => {
          const label = name && display_name && (name !== display_name)
            ? `${display_name} (${name})`
            : (display_name || name);

          return {
            label,
            value: id,
          };
        });
      },
    },
  },
  methods: {
    _baseUrl(domain: string) {
      return `https://${domain}/api/v4`;
    },
    _getAuth() {
      return {
        domain: this.$auth.domain,
        token: this.$auth.oauth_access_token,
      };
    },
    async _httpRequest({
      $ = this,
      endpoint,
      ...args
    }: HttpRequestParams): Promise<object> {
      const {
        domain, token,
      } = this._getAuth();
      return axios($, {
        url: this._baseUrl(domain) + endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...args,
      });
    },
    async postMessage(args: PostMessageParams): Promise<PostMessageResponse> {
      return this._httpRequest({
        endpoint: "/posts",
        method: "POST",
        ...args,
      });
    },
    async listChannels(): Promise<Channel[]> {
      return this._httpRequest({
        endpoint: "/channels",
      });
    },
    async listTeamChannels(teamId: string): Promise<Channel[]> {
      return this._httpRequest({
        endpoint: `/teams/${teamId}/channels`,
      });
    },
    async listTeams(): Promise<object[]> {
      return this._httpRequest({
        endpoint: "/teams",
      });
    },
    async createWebhook(data: object): Promise<object> {
      return this._httpRequest({
        endpoint: "/webhooks/outgoing",
        method: "POST",
        data,
      });
    },
    async deleteWebhook(id: string): Promise<object> {
      return this._httpRequest({
        endpoint: `/webhooks/outgoing/${id}`,
        method: "DELETE",
      });
    },
  },
});
