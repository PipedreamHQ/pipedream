import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "botpress",
  propDefinitions: {
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "ID of the conversation.",
      async options({ prevContext: { nextToken } }) {
        if (nextToken === false) {
          return [];
        }
        const {
          conversations,
          meta,
        } = await this.listConversations({
          ...(nextToken && {
            params: {
              nextToken: encodeURIComponent(nextToken),
            },
          }),
        });
        const options = conversations.map(({
          id: value, channel: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            nextToken: meta?.nextToken || false,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "ID of the user.",
      async options({ prevContext: { nextToken } }) {
        if (nextToken === false) {
          return [];
        }
        const {
          users,
          meta,
        } = await this.listUsers({
          ...(nextToken && {
            params: {
              nextToken: encodeURIComponent(nextToken),
            },
          }),
        });
        const options = users.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            nextToken: meta?.nextToken || false,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      const {
        identity_token: identityToken,
        bot_id: botId,
      } = this.$auth;
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${identityToken}`,
        "x-bot-id": botId,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/chat/users",
        ...args,
      });
    },
    listEvents(args = {}) {
      return this._makeRequest({
        debug: true,
        path: "/chat/events",
        ...args,
      });
    },
    listConversations(args = {}) {
      return this._makeRequest({
        path: "/chat/conversations",
        ...args,
      });
    },
    async *getIterations({
      resourcesFn, resourcesFnArgs, resourceName,
      max = constants.DEFAULT_MAX,
    }) {
      let nextToken;
      let resourcesCount = 0;

      while (true) {
        if (nextToken === false) {
          console.log("No more resources to paginate");
          return;
        }

        const response =
          await resourcesFn({
            ...resourcesFnArgs,
            params: {
              ...resourcesFnArgs?.params,
              nextToken,
            },
          });

        const nextResources = resourceName && response[resourceName] || response;

        if (!nextResources?.length) {
          console.log("No more resources found");
          return;
        }

        for (const resource of nextResources) {
          yield resource;
          resourcesCount += 1;

          if (resourcesCount >= max) {
            console.log("Reached max resources");
            return;
          }
        }

        nextToken = response.meta?.nextToken || false;
      }
    },
    paginate(args = {}) {
      return utils.iterate(this.getIterations(args));
    },
  },
};
