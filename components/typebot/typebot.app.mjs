import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "typebot",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Workspace ID",
      async options() {
        const { workspaces } = await this.listWorkspaces();
        return workspaces.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    typebotId: {
      type: "string",
      label: "Typebot ID",
      description: "Typebot ID",
      async options({ workspaceId }) {
        const { typebots } = await this.listTypebots({
          params: {
            workspaceId,
          },
        });
        return typebots.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    blockId: {
      type: "string",
      label: "Block ID",
      description: "Block ID",
      async options({
        typebotId, filterFn = (resource) => resource,
      }) {
        const { webhookBlocks } = await this.listWebhookBlocks({
          typebotId,
        });
        return webhookBlocks
          .filter(filterFn)
          .map(({
            id: value, label,
          }) => ({
            label,
            value,
          }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path) {
      return `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path),
        ...args,
      };

      try {
        return await axios(step, config);
      } catch (error) {
        console.log("Error", error);
        throw error;
      }
    },
    listWorkspaces(args = {}) {
      return this.makeRequest({
        path: "/workspaces",
        ...args,
      });
    },
    listTypebots(args = {}) {
      return this.makeRequest({
        path: "/typebots",
        ...args,
      });
    },
    listWebhookBlocks({
      typebotId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/typebots/${typebotId}/webhookBlocks`,
        ...args,
      });
    },
    subscribeToWebhookBlock({
      typebotId, blockId, ...args
    }) {
      return this.makeRequest({
        method: "post",
        path: `/typebots/${typebotId}/webhookBlocks/${blockId}/subscribe`,
        ...args,
      });
    },
    unsubscribeFromWebhookBlock({
      typebotId, blockId, ...args
    }) {
      return this.makeRequest({
        method: "post",
        path: `/typebots/${typebotId}/webhookBlocks/${blockId}/unsubscribe`,
        ...args,
      });
    },
  },
};
