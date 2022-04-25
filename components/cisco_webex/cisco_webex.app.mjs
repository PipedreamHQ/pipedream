import axios from "axios";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cisco_webex",
  propDefinitions: {
    roomId: {
      type: "string",
      label: "Room ID",
      description: "The ID of the room to post the message to.",
      async options({ prevContext }) {
        const { cursor } = prevContext;

        const {
          items: rooms,
          ...context
        } =
          await this.listRooms({
            params: {
              cursor,
            },
          });

        const options =
          rooms.map(({
            id, title,
          }) => ({
            label: title,
            value: id,
          }));

        return {
          options,
          context,
        };
      },
    },
    messageId: {
      type: "string",
      label: "Parent ID",
      description: "The ID of the parent message to reply to.",
      async options({
        roomId, prevContext,
      }) {
        const { cursor } = prevContext;

        const {
          items: messages,
          ...context
        } =
          await this.listMessages({
            params: {
              roomId,
              cursor,
            },
          });

        const options = messages.map(({
          id, text,
        }) => ({
          label: text,
          value: id,
        }));

        return {
          options,
          context,
        };
      },
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID for the team with which this room is associated.",
      optional: true,
      async options({ prevContext }) {
        const { cursor } = prevContext;

        const {
          items: teams,
          ...context
        } =
          await this.listTeams({
            params: {
              cursor,
            },
          });

        const options =
          teams.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          }));

        return {
          options,
          context,
        };
      },
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The person ID of the recipient when sending a private 1:1 message.",
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    getPaginationContext(headers) {
      const [
        linkUrl,
      ] = constants.REGEXP.URL.exec(headers?.link) || [];

      const [
        rel,
      ] = constants.REGEXP.REL.exec(headers?.link) || [];

      const url = linkUrl && new URL(linkUrl);
      const cursor = url?.searchParams.get("cursor");

      return {
        cursor,
        rel,
      };
    },
    async makeRequest(customConfig) {
      const {
        path,
        headers,
        ...otherConfig
      } = customConfig;

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...otherConfig,
      };

      try {
        const response = await axios(config);

        return {
          ...response.data,
          ...this.getPaginationContext(response.headers),
        };
      } catch (error) {
        console.error("Error", JSON.stringify(error.response.data, null, 2));
        throw error.response.data.message;
      }
    },
    async listRooms(args = {}) {
      return this.makeRequest({
        path: "/rooms",
        ...args,
      });
    },
    async listMessages(args = {}) {
      return this.makeRequest({
        path: "/messages",
        ...args,
      });
    },
    async listTeams(args = {}) {
      return this.makeRequest({
        path: "/teams",
        ...args,
      });
    },
    async createMessage(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/messages",
        ...args,
      });
    },
    async createPerson(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/people",
        ...args,
      });
    },
    async createRoom(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/rooms",
        ...args,
      });
    },
    async createWebhook(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/webhooks",
        ...args,
      });
    },
    async deleteWebhook({
      webhookId, ...args
    } = {}) {
      return this.makeRequest({
        method: "delete",
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    /**
     * getResourcesStream always gets the latest resources from the API.
     * @param {Object} args - all arguments to pass to the `getResourcesStream` function
     * @param {Function} args.resouceFn - the name of the resource function to call
     * @param {Object} args.resourceFnArgs - the arguments object to pass to the resource function
     * @param {number} [args.max] - the maximum number of resources to get
     * @param {string} [args.lastResourceStr] - the last resource string in cache
     * to validate against. This parameter is only passed in from sources.
     * @returns {Iterable} - Iterable that yields resources,
     *  the first element is the last resource string in cache
     */
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      maxResources = 100,
      lastResourceStr,
    }) {
      let cursor;
      let resourcesCount = 0;

      while (true) {
        const nextResponse =
          await resourceFn({
            ...resourceFnArgs,
            params: {
              ...resourceFnArgs.params,
              cursor,
            },
          });

        if (!nextResponse) {
          throw new Error("No response from the Cisco Webex API.");
        }

        const nextResources = nextResponse.items;

        if (nextResponse.cursor) {
          cursor = nextResponse.cursor;
        }

        for (const resource of nextResources) {
          if (lastResourceStr && JSON.stringify(resource) === lastResourceStr) {
            return;
          }

          if (resourcesCount >= maxResources) {
            return;
          }

          yield resource;

          resourcesCount += 1;
        }

        if (!nextResponse?.cursor || (maxResources && resourcesCount >= maxResources)) {
          return;
        }
      }
    },
  },
};
