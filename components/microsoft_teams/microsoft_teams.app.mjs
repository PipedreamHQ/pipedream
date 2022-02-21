import { axios } from "@pipedream/platform";
import { Client } from "@microsoft/microsoft-graph-client";
import "isomorphic-fetch";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "microsoft_teams",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team",
      async options({ page  }) {
        const top = constants.DEFAULT_PAGE_LIMIT;

        const resp =
          await this.listJoinedTeams({
            params: {
              count: true,
              skip: page * top,
              top,
            },
          });

        // const resp =
        //   await this.listTeams({
        //     params: {
        //       count: true,
        //       skip: page * top,
        //       top,
        //       version: "beta",
        //     },
        //   });

        console.log("resp", resp);

        const { value: teams } = resp;

        return teams.map(({
          id, displayName,
        }) => ({
          value: id,
          label: displayName,
        }));

        // return this.getTeamsOptions();
      },
    },
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of the channel",
      async options({ teamId }) {
        const { value: channels } =
          await this.microsoftTeams.listChannels({
            teamId,
          });

        return channels.map(({
          id, displayName,
        }) => ({
          value: id,
          label: displayName,
        }));

      },
    },
    chatId: {
      type: "string",
      label: "Chat ID",
      description: "The ID of the chat",
      async options({
        teamId, page,
      }) {
        const top = constants.DEFAULT_PAGE_LIMIT;

        const resp =
          await this.microsoftTeams.listChats({
            teamId,
            params: {
              count: true,
              skip: page * top,
              top,
            },
          });

        console.log("resp", resp);
        const { value: chats } = resp;

        return chats.map(({
          id, topic,
        }) => ({
          value: id,
          label: topic,
        }));

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
      optional: false,
    },
    userSearch: {
      type: "string",
      label: "Search",
      description: "Search users by this string",
    },
    max: {
      type: "integer",
      label: "Max records",
      description: "Max number of records in the whole pagination",
      optional: false,
      default: constants.DEFAULT_MAX_ITEMS,
      min: 1,
    },
  },
  methods: {
    client() {
      const { oauth_access_token: accessToken } = this.$auth;
      return Client.init({
        authProvider: (callback) => {
          callback(undefined, accessToken);
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
    getRequestHeaders(config) {
      const authorization = `Bearer ${this.$auth.oauth_access_token}`;
      return {
        ...config?.headers,
        authorization,
      };
    },
    async makeRequestV2(customConfig) {
      const {
        $,
        path,
        ...otherConfig
      } = customConfig;

      const headers = this.getRequestHeaders(otherConfig);
      const url = `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;

      const config = {
        ...otherConfig,
        headers,
        url,
        timeout: 10000,
      };

      return axios($ ?? this, config);
    },
    async listUsers({ params }) {
      return this.makeRequest({
        path: "/users",
        params,
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
    // This endpoint doesn't seem to support pagination!
    // https://docs.microsoft.com/en-us/graph/api/channel-list?view=graph-rest-1.0&tabs=javascript#optional-query-parameters
    async listChannels({ teamId }) {
      return this.makeRequest({
        path: `/teams/${teamId}/channels`,
      });
    },
    async listChats({ params }) {
      return this.makeRequest({
        path: "/me/chats",
        params,
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
    async listGroups({ params }) {
      return this.makeRequest({
        path: "/groups",
        params,
      });
    },
    async getTeam({
      groupId, params,
    }) {
      return this.makeRequest({
        path: `/teams/${groupId}`,
        params,
      });
    },
    async listTeams({ params }) {
      return this.makeRequest({
        path: "/teams",
        params,
      });
    },
    async listJoinedTeams({ params }) {
      return this.makeRequestV2({
        path: "/me/joinedTeams",
        params,
      });
    },
    async getTeamGroupIds() {
      const { value: groups } =
        await this.listGroups({
          params: {
            select: "id,resourceProvisioningOptions",
          },
        });
      console.log("groups", groups);
      return groups
        .filter(({ resourceProvisioningOptions: options }) => {
          const [
            option,
          ] = options;
          return option === constants.TEAM_PROVISIONING_OPTION;
        })
        .map(({ id }) => id);
    },
    async getTeams() {
      // Get a list of groups
      // https://docs.microsoft.com/en-us/graph/teams-list-all-teams?view=graph-rest-1.0#get-a-list-of-groups
      const groupIds = await this.getTeamGroupIds();

      // Get team information for a group
      // https://docs.microsoft.com/en-us/graph/teams-list-all-teams?view=graph-rest-1.0#get-team-information-for-a-group
      const promises =
        groupIds.map((groupId) =>
          this.getTeam({
            groupId,
            version: "beta",
          }));

      return Promise.all(promises);
    },
    async getTeamsOptions() {
      const teams = this.getTeams();
      console.log("teams", teams);
      return teams.map(({ id }) => ({
        value: id,
        label: id,
      }));
    },
    /**
     * getResourcesStream always gets the latest resources from the API.
     * @param {Object} args - all arguments to pass to the `getResourcesStream` function
     * @param {Function} args.resouceFn - the name of the resource function to call
     * @param {Object} args.resourceFnArgs - the arguments object to pass to the resource function
     * @param {number} [args.offset] - the offset to start at
     * @param {number} [args.limit=100] - the number of resources to get per page
     * @param {number} [args.max] - the maximum number of resources to get
     * @param {string} [args.lastResourceStr] - the last resource string in cache
     * to validate against. This parameter is only passed in from sources.
     * @returns {Iterable} - Iterable that yields resources,
     *  the first element is the last resource string in cache
     */
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.DEFAULT_MAX_ITEMS,
      lastResourceStr,
    }) {
      let page = 0;
      let resourcesCount = 0;

      while (true) {
        const nextResponse = await resourceFn({
          ...resourceFnArgs,
          params: {
            ...resourceFnArgs.params,
            skip: resourceFnArgs.params.top * page,
          },
        });
        console.log("nextResponse", nextResponse);

        if (!nextResponse) {
          throw new Error("No response from the API");
        }

        const nextResources = nextResponse.value;

        for (const resource of nextResources) {
          if (lastResourceStr && JSON.stringify(resource) === lastResourceStr) {
            return;
          }

          yield resource;

          resourcesCount += 1;
        }

        page += 1;

        // if (!nextResponse?.meta.next || (max && resourcesCount >= max)) {
        if ((max && resourcesCount >= max)) {
          return;
        }
      }
    },
  },
};
