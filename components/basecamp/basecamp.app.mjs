import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";

export default {
  type: "app",
  app: "basecamp",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "Select an account or provide an account ID.",
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
      label: "Project ID",
      description: "Select a project or provide a project ID.",
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
      label: "Message Board ID",
      description: "Select a message board or provide a message board ID.",
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
      label: "Recording ID",
      description: "Select a recording or provide a recording ID.",
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
      description: "One or more people visible to the current user.",
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
      label: "To-do Set Id",
      description: "Select a to-do set or provide a to-do set ID.",
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
      label: "Campfire ID",
      description: "Select a campfire or provide a campfire ID.",
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
      label: "To-do List Id",
      description: "The ID of the to-do list.",
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
      label: "Message Type",
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
      label: "Card Table ID",
      description: "Select a card table or provide a card table ID.",
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
      label: "Card Column ID",
      description: "Select a card column or provide a column ID.",
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
    cardId: {
      type: "string",
      label: "Card ID",
      description: "Select a card or provide a card ID.",
      async options({
        accountId, projectId, columnId,
      }) {
        const cards = await this.getCards({
          accountId,
          projectId,
          columnId,
        });
        return cards.map(({
          id: value, title: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    botId: {
      type: "string",
      label: "Chatbot ID",
      description: "Select a chatbot to send the message from.",
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
        ...args,
      });
    },
    async getPeople({
      projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/projects/${projectId}/people.json`,
        ...args,
      });
    },
    async getMessageTypes({
      projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/buckets/${projectId}/categories.json`,
        ...args,
      });
    },
    async getProject({
      projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/projects/${projectId}.json`,
        ...args,
      });
    },
    async getRecordings(args = {}) {
      return this.makeRequest({
        path: "/projects/recordings.json",
        ...args,
      });
    },
    async getTodoLists({
      projectId, todoSetId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/buckets/${projectId}/todosets/${todoSetId}/todolists.json`,
        ...args,
      });
    },
    async createMessage({
      projectId, messageBoardId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/buckets/${projectId}/message_boards/${messageBoardId}/messages.json`,
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
    async createCampfireMessage({
      projectId, campfireId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/buckets/${projectId}/chats/${campfireId}/lines.json`,
        method: "post",
        ...args,
      });
    },
    async createComment({
      projectId, recordingId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/buckets/${projectId}/recordings/${recordingId}/comments.json`,
        method: "post",
        ...args,
      });
    },
    async createTodoItem({
      projectId, todoListId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/buckets/${projectId}/todolists/${todoListId}/todos.json`,
        method: "post",
        ...args,
      });
    },
    async createWebhook({
      projectId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/buckets/${projectId}/webhooks.json`,
        method: "post",
        ...args,
      });
    },
    async deleteWebhook({
      projectId, webhookId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/buckets/${projectId}/webhooks/${webhookId}.json`,
        method: "delete",
        ...args,
      });
    },
    getCardTable({
      projectId, cardTableId, ...args
    }) {
      return this.makeRequest({
        path: `/buckets/${projectId}/card_tables/${cardTableId}.json`,
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
    async getColumns(args) {
      const { lists } = await this.getCardTable(args);
      return lists;
    },
    async getCards({
      projectId, columnId, ...args
    }) {
      return this.makeRequest({
        path: `/buckets/${projectId}/card_tables/lists/${columnId}/cards.json`,
        ...args,
      });
    },
    getChatbot({
      projectId, campfireId, botId, ...args
    }) {
      return this.makeRequest({
        path: `/buckets/${projectId}/chats/${campfireId}/integrations/${botId}.json`,
        ...args,
      });
    },
    listChatbots({
      projectId, campfireId, ...args
    }) {
      return this.makeRequest({
        path: `/buckets/${projectId}/chats/${campfireId}/integrations.json`,
        ...args,
      });
    },
  },
};
