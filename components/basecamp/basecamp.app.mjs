import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "basecamp",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account Id",
      description: "The ID of the account.",
      async options() {
        const accounts = await this.getAccounts({});
        return accounts.map(({
          id,
          name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    projectId: {
      type: "string",
      label: "Project Id",
      description: "The ID of the project.",
      async options({ accountId }) {
        const projects = await this.getProjects({
          accountId,
        });
        return projects.map(({
          id,
          name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    messageBoardId: {
      type: "string",
      label: "Message Board Id",
      description: "The ID of the message board.",
      async options({
        accountId,
        projectId,
      }) {
        const project = await this.getProject({
          accountId,
          projectId,
        });
        return project.dock.filter((dock) => dock.name === "message_board")
          .map(({
            id,
            title,
          }) => ({
            label: title,
            value: id,
          }));
      },
    },
    messageTypeId: {
      type: "string",
      label: "Message Types",
      description: "Select a type for the message.",
      async options({
        accountId,
        projectId,
      }) {
        const types = await this.getMessageTypes({
          accountId,
          projectId,
        });
        return types.map(({
          id,
          name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
  },
  methods: {
    async getAccounts({ $ = this }) {
      const { accounts } = await axios($, {
        url: "https://launchpad.37signals.com/authorization.json",
        headers: this.getHeaders(),
      });
      return accounts;
    },
    getBaseUrl(accountId) {
      return `https://3.basecampapi.com/${accountId}`;
    },
    getUrl(accountId, path) {
      return `${this.getBaseUrl(accountId)}${path}`;
    },
    getHeaders(headers = {}) {
      return {
        authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    makeRequest(customConfig) {
      const {
        $ = this,
        accountId,
        path,
        headers,
        ...otherConfig
      } = customConfig;

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(accountId, path),
        ...otherConfig,
      };
      return axios($, config);
    },
    async getProjects(args = {}) {
      return this.makeRequest({
        path: "/projects.json",
        accountId: args.accountId,
        ...args,
      });
    },
    async getMessageTypes(args = {}) {
      return this.makeRequest({
        path: `/buckets/${args.projectId}/categories.json`,
        accountId: args.accountId,
        ...args,
      });
    },
    async getProject(args = {}) {
      return this.makeRequest({
        path: `/projects/${args.projectId}.json`,
        accountId: args.accountId,
        ...args,
      });
    },
    async createMessage(args = {}) {
      return this.makeRequest({
        $: args.$,
        accountId: args.accountId,
        path: `/buckets/${args.projectId}/message_boards/${args.messageBoardId}/messages.json`,
        method: "post",
        ...args,
      });
    },
  },
};
