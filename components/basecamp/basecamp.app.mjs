import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";

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
      async options({
        accountId, page,
      }) {
        const projects = await this.getProjects({
          accountId,
          params: {
            page: page + 1,
          },
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
        return project.dock.filter((dock) => dock.name === "message_board" && dock.enabled === true)
          .map(({
            id,
            title,
          }) => ({
            label: title,
            value: id,
          }));
      },
    },
    recordingId: {
      type: "string",
      label: "Recording Id",
      description: "The ID of the recording.",
      async options({
        accountId,
        projectId,
        recordingType,
        page,
      }) {
        if (!recordingType) {
          return [];
        }
        const recordings = await this.getRecordings({
          accountId,
          params: {
            type: recordingType,
            bucket: projectId,
            page: page + 1,
          },
        });
        return recordings
          .map(({
            id,
            title,
          }) => ({
            label: title,
            value: id,
          }));
      },
    },
    recordingType: {
      type: "string",
      label: "Recording Type",
      description: "The type of the recording.",
      options: constants.RECORDING_TYPE_OPTS,
    },
    peopleIds: {
      type: "string[]",
      label: "People",
      description: "An array of all people visible to the current user.",
      async options({
        accountId,
        projectId,
        page,
      }) {
        const people = await this.getPeople({
          accountId,
          projectId,
          params: {
            page: page + 1,
          },
        });
        return people.
          map(({
            id,
            name,
          }) => ({
            label: name,
            value: id,
          }));
      },
    },
    todoSetId: {
      type: "string",
      label: "Todo Set Id",
      description: "The ID of the todo set.",
      async options({
        accountId,
        projectId,
      }) {
        const project = await this.getProject({
          accountId,
          projectId,
        });
        return project.dock.filter((dock) => dock.name === "todoset" && dock.enabled === true)
          .map(({
            id,
            title,
          }) => ({
            label: title,
            value: id,
          }));
      },
    },
    campfireId: {
      type: "string",
      label: "Campfire Id",
      description: "The ID of the campfire.",
      async options({
        accountId,
        projectId,
      }) {
        const project = await this.getProject({
          accountId,
          projectId,
        });
        return project.dock.filter((dock) => dock.name === "chat" && dock.enabled === true)
          .map(({
            id,
            title,
          }) => ({
            label: title,
            value: id,
          }));
      },
    },
    todoListId: {
      type: "string",
      label: "Todo List Id",
      description: "The ID of the todo list.",
      async options({
        accountId,
        projectId,
        todoSetId,
        page,
      }) {
        const todoslists = await this.getTodoLists({
          accountId,
          projectId,
          todoSetId,
          params: {
            page: page + 1,
          },
        });
        return todoslists
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
    cardTableId: {
      type: "string",
      label: "Card Table Id",
      description: "The card table ID",
      async options({
        accountId, projectId,
      }) {
        const columns = await this.getCardTables({
          accountId,
          projectId,
        });
        return columns.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    columnId: {
      type: "string",
      label: "Column ID",
      description: "The column ID",
      async options({
        accountId, projectId, cardTableId,
      }) {
        const columns = await this.getColumns({
          accountId,
          projectId,
          cardTableId,
        });
        return columns.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    botId: {
      type: "string",
      label: "Chat Bot ID",
      description: "The ID of the chatbot to send message from",
      async options({
        accountId, projectId, campfireId,
      }) {
        const bots = await this.listChatbots({
          accountId,
          projectId,
          campfireId,
        });
        return bots?.map(({
          id: value, service_name: label,
        }) => ({
          value,
          label,
        })) || [];
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
    async getPeople(args = {}) {
      return this.makeRequest({
        path: `/projects/${args.projectId}/people.json`,
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
    async getRecordings(args = {}) {
      return this.makeRequest({
        path: "/projects/recordings.json",
        accountId: args.accountId,
        ...args,
      });
    },
    async getTodoLists(args = {}) {
      return this.makeRequest({
        path: `/buckets/${args.projectId}/todosets/${args.todoSetId}/todolists.json`,
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
    async createCard({
      columnId, projectId, ...args
    }) {
      return this.makeRequest({
        path: `/buckets/${projectId}/card_tables/lists/${columnId}/cards.json`,
        method: "post",
        ...args,
      });
    },
    async createCampfireMessage(args = {}) {
      return this.makeRequest({
        $: args.$,
        accountId: args.accountId,
        path: `/buckets/${args.projectId}/chats/${args.campfireId}/lines.json`,
        method: "post",
        ...args,
      });
    },
    async createComment(args = {}) {
      return this.makeRequest({
        $: args.$,
        accountId: args.accountId,
        path: `/buckets/${args.projectId}/recordings/${args.recordingId}/comments.json`,
        method: "post",
        ...args,
      });
    },
    async createTodoItem(args = {}) {
      return this.makeRequest({
        $: args.$,
        accountId: args.accountId,
        path: `/buckets/${args.projectId}/todolists/${args.todoListId}/todos.json`,
        method: "post",
        ...args,
      });
    },
    async createWebhook(args = {}) {
      return this.makeRequest({
        path: `/buckets/${args.projectId}/webhooks.json`,
        accountId: args.accountId,
        method: "post",
        ...args,
      });
    },
    async deleteWebhook(args = {}) {
      return this.makeRequest({
        path: `/buckets/${args.projectId}/webhooks/${args.webhookId}.json`,
        accountId: args.accountId,
        method: "delete",
        ...args,
      });
    },
    getCardTable({
      accountId, projectId, cardTableId, ...args
    }) {
      return this.makeRequest({
        path: `/buckets/${projectId}/card_tables/${cardTableId}.json`,
        accountId,
        ...args,
      });
    },
    async getCardTables({
      accountId, projectId,
    }) {
      const { dock } = await this.getProject({
        accountId,
        projectId,
      });
      const cardTables = dock.filter(({ name }) => name === "kanban_board");
      return cardTables;
    },
    async getColumns({
      accountId, projectId, cardTableId,
    }) {
      const { lists } = await this.getCardTable({
        accountId,
        projectId,
        cardTableId: cardTableId,
      });
      return lists;
    },
    getChatbot({
      accountId, projectId, campfireId, botId, ...args
    }) {
      return this.makeRequest({
        path: `/buckets/${projectId}/chats/${campfireId}/integrations/${botId}.json`,
        accountId,
        ...args,
      });
    },
    listChatbots({
      accountId, projectId, campfireId, ...args
    }) {
      return this.makeRequest({
        path: `/buckets/${projectId}/chats/${campfireId}/integrations.json`,
        accountId,
        ...args,
      });
    },
  },
};
