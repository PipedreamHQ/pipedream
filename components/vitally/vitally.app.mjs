import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vitally",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account Id",
      description: "The Id of the Vitally Account to associate the task with.",
      async options({ prevContext }) {
        const {
          results, next,
        } = await this.listAccounts({
          params: {
            from: prevContext.from,
          },
        });

        return {
          options: results.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            from: next,
          },
        };
      },
    },
    assignedToId: {
      type: "string",
      label: "Assigned To Id",
      description: "The Id of the Vitally Admin User who completed to the Task.",
      async options({ prevContext }) {
        const {
          results, next,
        } = await this.listUsers({
          params: {
            from: prevContext.from,
          },
        });

        return {
          options: results.map(({
            id: value, name, email,
          }) => ({
            label: `(${name}) ${email}`,
            value,
          })),
          context: {
            from: next,
          },
        };
      },
    },
    categoryId: {
      type: "string",
      label: "Category Id",
      description: "The Vitally ID of the Task Category.",
      async options({ prevContext }) {
        const {
          results, next,
        } = await this.listTaskCategories({
          params: {
            from: prevContext.from,
          },
        });

        return {
          options: results.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            from: next,
          },
        };
      },
    },
    conversationId: {
      type: "string",
      label: "Conversation Id",
      description: "The Conversation ID.",
      async options({ prevContext }) {
        const {
          results, next,
        } = await this.listConversations({
          params: {
            from: prevContext.from,
          },
        });

        return {
          options: results.map(({
            id: value, subject: label,
          }) => ({
            label,
            value,
          })),
          context: {
            from: next,
          },
        };
      },
    },
    externalId: {
      type: "string",
      label: "External Id",
      description: "The unique Id of the task on your system.",
    },
    noteCategoryId: {
      type: "string",
      label: "Category Id",
      description: "The ID of the Vitally Note Category the Note belongs to.",
      async options({ prevContext }) {
        const {
          results, next,
        } = await this.listNoteCategories({
          params: {
            from: prevContext.from,
          },
        });

        return {
          options: results.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            from: next,
          },
        };
      },
    },
    organizationId: {
      type: "string",
      label: "Organization Id",
      description: "The Vitally assigned ID of the Organization.",
      async options({ prevContext }) {
        const {
          results, next,
        } = await this.listOrganizations({
          params: {
            from: prevContext.from,
          },
        });

        return {
          options: results.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            from: next,
          },
        };
      },
    },
    from: {
      type: "string",
      label: "From",
      description: "The sender participant.",
      async options({
        organizationId, prevContext,
      }) {
        const {
          results, next,
        } = await this.listOrganizationUsers({
          organizationId,
          params: {
            from: prevContext.from,
          },
        });

        return {
          options: results.map(({
            id: value, name, email,
          }) => ({
            label: `(${name}) ${email}`,
            value,
          })),
          context: {
            from: next,
          },
        };
      },
    },
  },
  methods: {
    _apiUrl() {
      const subdomain = this.$auth.subdomain;
      return `https://${subdomain}.rest.vitally.io/resources`;
    },
    _getAuth() {
      return {
        username: `${this.$auth.api_key}`,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        auth: this._getAuth(),
        ...opts,
      };

      return axios($, config);
    },
    createMessage({
      conversationId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `conversations/${conversationId}/messages`,
        ...args,
      });
    },
    createNote(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "notes",
        ...args,
      });
    },
    createTask(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "tasks",
        ...args,
      });
    },
    listAccounts(args = {}) {
      return this._makeRequest({
        path: "accounts",
        ...args,
      });
    },
    listConversations(args = {}) {
      return this._makeRequest({
        path: "conversations",
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this._makeRequest({
        path: "organizations",
        ...args,
      });
    },
    listNoteCategories(args = {}) {
      return this._makeRequest({
        path: "noteCategories",
        ...args,
      });
    },
    listTaskCategories(args = {}) {
      return this._makeRequest({
        path: "taskCategories",
        ...args,
      });
    },
    listUsers({
      accountId, organizationId, ...args
    }) {
      let path = "";
      if (accountId) {
        path = `accounts/${accountId}/`;
      }
      if (organizationId) {
        path = `organizations/${organizationId}/`;
      }
      return this._makeRequest({
        path: `${path}users`,
        ...args,
      });
    },
    listOrganizationUsers({
      organizationId, ...args
    }) {
      return this._makeRequest({
        path: `organizations/${organizationId}/users`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, accountId, organizationId, maxResults = null,
    }) {
      let length = 0;
      let count = 0;
      let from = "";

      do {
        params.from = from;
        const {
          results,
          next,
        } = await fn({
          accountId,
          organizationId,
          params,
        });
        for (const d of results) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        from = next;
        length = results.length;

      } while (length);
    },
  },
};
