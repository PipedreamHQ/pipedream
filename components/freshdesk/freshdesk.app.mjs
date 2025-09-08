import constants from "./common/constants.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "freshdesk",
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company ID",
      description: "Select a company or provide a company ID",
      async options() {
        const response = await this.getCompanies();
        return response.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    ticketId: {
      type: "integer",
      label: "Ticket ID",
      description: "Select a ticket or provide a ticket ID",
      async options({ page = 0 }) {
        const response = await this.listTickets({
          params: {
            page: page + 1,
          },
        });
        return response.map(({
          id, subject,
        }) => ({
          label: subject || id,
          value: id,
        }));
      },
    },
    agentId: {
      type: "integer",
      label: "Agent",
      description: "Select an agent to assign the ticket to",
      async options({ page = 0 }) {
        const response = await this._makeRequest({
          method: "GET",
          url: "/agents",
          params: {
            page: page + 1,
          },
        });

        return response.map((agent) => ({
          label: agent.contact?.name
            ? `${agent.contact.name} (${agent.contact.email || "No email"})`
            : `Agent ${agent.id}`,
          value: agent.id,
        }));
      },
    },
    groupId: {
      type: "integer",
      label: "Group",
      description: "Select a group to assign the ticket to.",
      async options({ page = 0 }) {
        const groups = await this._makeRequest({
          method: "GET",
          url: "/groups",
          params: {
            page: page + 1,
            per_page: 100,
          },
        });

        return groups.map((group) => ({
          label: group.name || `Group ${group.id}`,
          value: group.id,
        }));
      },
    },
    ticketStatus: {
      type: "integer",
      label: "Status",
      description: "Status of the ticket",
      options() {
        return constants.TICKET_STATUS;
      },
    },
    ticketPriority: {
      type: "integer",
      label: "Priority",
      description: "Priority of the ticket",
      options() {
        return constants.TICKET_PRIORITY;
      },
    },
    contactEmail: {
      type: "string",
      label: "Email",
      description: "Select a contact or provide a contact's email",
      async options({ companyId }) {
        const contacts = await this.getContacts({
          params: {
            company_id: companyId,
          },
        });
        return contacts
          .filter(({ email }) => email)
          .map(({
            email, name,
          }) => ({
            label: name || email,
            value: email,
          }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of a contact",
      async options({
        companyId, page,
      }) {
        const contacts = await this.getContacts({
          params: {
            company_id: companyId,
            page: page + 1,
          },
        });
        return contacts
          .map(({
            id, name, email,
          }) => ({
            label: name || email,
            value: id,
          }));
      },
    },
    ticketFieldId: {
      type: "string",
      label: "Ticket Field ID",
      description: "The ID of a ticket field",
      async options({ page }) {
        const fields = await this.listTicketFields({
          params: {
            page: page + 1,
          },
        });
        return fields.map(({
          id, label,
        }) => ({
          label: label || id,
          value: id,
        }));
      },
    },
    skillIds: {
      type: "string[]",
      label: "Skill IDs",
      description: "Array of skill IDs",
      optional: true,
      async options({ page }) {
        const skills = await this.listSkills({
          params: {
            page: page + 1,
          },
        });
        return skills.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    roleIds: {
      type: "string[]",
      label: "Role IDs",
      description: "Array of role IDs",
      optional: true,
      async options() {
        const roles = await this.listRoles();
        return roles.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    categoryId: {
      type: "integer",
      label: "Category ID",
      description: "The ID of a category",
      async options() {
        const categories = await this.listSolutionCategories();
        return categories.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    folderId: {
      type: "integer",
      label: "Folder ID",
      description: "The ID of a folder",
      async options({ categoryId }) {
        const folders = await this.listCategoryFolders({
          categoryId,
        });
        return folders.map(({
          id, name,
        }) => ({
          label: name || id,
          value: id,
        }));
      },
    },
    articleId: {
      type: "integer",
      label: "Article ID",
      description: "The ID of an article",
      async options({
        page, folderId,
      }) {
        const articles = await this.listFolderArticles({
          folderId,
          params: {
            page: page + 1,
          },
        });
        return articles.map(({
          id, title,
        }) => ({
          label: title || id,
          value: id,
        }));
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
    ticketTags: {
      type: "string[]",
      label: "Tags",
      description: "Array of tags to apply to the ticket. Each tag must be 32 characters or less.",
      optional: true,
    },
  },
  methods: {
    setLastDateChecked(db, value) {
      db && db.set(constants.DB_LAST_DATE_CHECK, value);
    },
    getLastDateChecked(db) {
      return db && db.get(constants.DB_LAST_DATE_CHECK);
    },
    base64Encode(data) {
      return Buffer.from(data).toString("base64");
    },
    _getHeaders() {
      return {
        "Authorization": "Basic " + this.base64Encode(this.$auth.api_key + ":X"),
        "Content-Type": "application/json;charset=utf-8",
      };
    },
    _getDomain() {
      const { domain } = this.$auth;
      return domain.includes("freshdesk.com")
        ? domain
        : `${domain}.freshdesk.com`;
    },
    async _makeRequest({
      $ = this, headers, ...args
    }) {
      return axios($, {
        baseURL: `https://${this._getDomain()}/api/v2`,
        headers: {
          ...this._getHeaders(),
          ...headers,
        },
        ...args,
      });
    },
    async *filterTickets(params) {
      let loadedData = 0;
      do {
        const response = await this.searchTickets({
          params,
        });

        if (!response?.results?.length) {
          return;
        }
        loadedData += response.results.length;
        for (const ticket of response.results) {
          yield ticket;
        }
        if (loadedData >= response.total) {
          return;
        }
        params.page += 1;
      } while (true);
    },
    async *filterContacts(params) {
      let loadedData = 0;
      do {
        const response = await this.searchContacts({
          params,
        });

        if (!response?.results?.length) {
          return;
        }
        loadedData += response.results.length;
        for (const ticket of response.results) {
          yield ticket;
        }
        if (loadedData >= response.total) {
          return;
        }
        params.page += 1;
      } while (true);
    },
    async createCompany(args) {
      return this._makeRequest({
        url: "/companies",
        method: "post",
        ...args,
      });
    },
    async getCompanies(args) {
      return this._makeRequest({
        url: "/companies",
        ...args,
      });
    },
    async getContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        url: `/contacts/${contactId}`,
        ...args,
      });
    },
    async getContacts(args) {
      return this._makeRequest({
        url: "/contacts",
        ...args,
      });
    },
    async createContact(args) {
      return this._makeRequest({
        url: "/contacts",
        method: "post",
        ...args,
      });
    },
    async updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        url: `/contacts/${contactId}`,
        method: "put",
        ...args,
      });
    },
    async createTicket(args) {
      return this._makeRequest({
        url: "/tickets",
        method: "post",
        ...args,
      });
    },
    async getTicket({
      ticketId, ...args
    }) {
      return this._makeRequest({
        url: `/tickets/${ticketId}`,
        ...args,
      });
    },
    async searchTickets(args) {
      return this._makeRequest({
        url: "/search/tickets",
        ...args,
      });
    },
    async searchContacts(args) {
      return this._makeRequest({
        url: "/search/contacts",
        ...args,
      });
    },
    async listTicketFields(args) {
      return this._makeRequest({
        url: "/ticket_fields",
        ...args,
      });
    },
    async createTicketField(args) {
      return this._makeRequest({
        url: "/admin/ticket_fields",
        method: "post",
        ...args,
      });
    },
    async updateTicketField({
      ticketFieldId, ...args
    }) {
      return this._makeRequest({
        url: `/admin/ticket_fields/${ticketFieldId}`,
        method: "put",
        ...args,
      });
    },
    async listAgents(args) {
      return this._makeRequest({
        url: "/agents",
        ...args,
      });
    },
    async createAgent(args) {
      return this._makeRequest({
        url: "/agents",
        method: "post",
        ...args,
      });
    },
    async updateAgent({
      agentId, ...args
    }) {
      return this._makeRequest({
        url: `/agents/${agentId}`,
        method: "put",
        ...args,
      });
    },
    async listSkills(args) {
      return this._makeRequest({
        url: "/admin/skills",
        ...args,
      });
    },
    async listRoles(args) {
      return this._makeRequest({
        url: "/roles",
        ...args,
      });
    },
    async listSolutionCategories(args) {
      return this._makeRequest({
        url: "/solutions/categories",
        ...args,
      });
    },
    async listCategoryFolders({
      categoryId, ...args
    }) {
      return this._makeRequest({
        url: `/solutions/categories/${categoryId}/folders`,
        ...args,
      });
    },
    async listFolderArticles({
      folderId, ...args
    }) {
      return this._makeRequest({
        url: `/solutions/folders/${folderId}/articles`,
        ...args,
      });
    },
    async getArticle({
      articleId, ...args
    }) {
      return this._makeRequest({
        url: `/solutions/articles/${articleId}`,
        ...args,
      });
    },
    async createArticle({
      folderId, ...args
    }) {
      return this._makeRequest({
        url: `/solutions/folders/${folderId}/articles`,
        method: "post",
        ...args,
      });
    },
    async updateArticle({
      articleId, ...args
    }) {
      return this._makeRequest({
        url: `/solutions/articles/${articleId}`,
        method: "put",
        ...args,
      });
    },
    async deleteArticle({
      articleId, ...args
    }) {
      return this._makeRequest({
        url: `/solutions/articles/${articleId}`,
        method: "delete",
        ...args,
      });
    },
    async listTickets(args) {
      return this._makeRequest({
        url: "/tickets",
        ...args,
      });
    },
    async getTicketName(ticketId) {
      try {
        const ticket = await this.getTicket({
          ticketId,
        });
        return ticket.subject;
      } catch (error) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    parseIfJSONString(input) {
      if (typeof input === "string") {
        try {
          return JSON.parse(input);
        } catch (error) {
          return input;
        }
      }
      return input;
    },
    /**
     * Add a note to a Freshdesk ticket
     * @param {Object} options - The options object
     * @param {number} options.ticketId - The ID of the ticket to add the note to
     * @param {Object} options.data - The note data object
     * @param {string} options.data.body - Content of the note in HTML format
     * @param {boolean} [options.data.private=false] - Whether the note is private
     * @param {boolean} [options.data.incoming] - Whether the note is incoming
     * @param {number} [options.data.user_id] - ID of the user creating the note
     * @param {string[]} [options.data.notify_emails] - Array of email addresses to notify
     * @param {...*} args - Additional arguments passed to _makeRequest
     * @returns {Promise<Object>} The API response containing the created note
     */
    async addNoteToTicket({
      ticketId, data, ...args
    }) {
      return this._makeRequest({
        url: `/tickets/${ticketId}/notes`,
        method: "post",
        data,
        ...args,
      });
    },
    /**
     * Set tags on a ticket (replaces all existing tags)
     * @param {object} args - Arguments object
     * @param {string|number} args.ticketId - The ticket ID
     * @param {string[]} args.tags - Array of tags to set
     * @returns {Promise<object>} API response
     */
    async setTicketTags({
      ticketId, tags, ...args
    }) {
      return this._makeRequest({
        url: `/tickets/${ticketId}`,
        method: "PUT",
        data: {
          tags,
        },
        ...args,
      });
    },
    /**
     * Add tags to a ticket (appends to existing tags)
     * @param {object} args - Arguments object
     * @param {string|number} args.ticketId - The ticket ID
     * @param {string[]} args.tags - Array of tags to add
     * @returns {Promise<object>} API response
     */
    async addTicketTags({
      ticketId, tags, ...args
    }) {
      // Get current ticket to merge tags
      const ticket = await this.getTicket({
        ticketId,
        ...args,
      });
      const currentTags = ticket.tags || [];
      const newTags = [
        ...new Set([
          ...currentTags,
          ...tags,
        ]),
      ]; // Remove duplicates

      return this.setTicketTags({
        ticketId,
        tags: newTags,
        ...args,
      });
    },
    /**
     * Remove specific tags from a ticket
     * @param {object} args - Arguments object
     * @param {string|number} args.ticketId - The ticket ID
     * @param {string[]} args.tags - Array of tags to remove
     * @returns {Promise<object>} API response
     */
    async removeTicketTags({
      ticketId, tags, ...args
    }) {
      // Get current ticket to filter tags
      const ticket = await this.getTicket({
        ticketId,
        ...args,
      });
      const currentTags = ticket.tags || [];
      const tagsToRemove = new Set(tags);
      const remainingTags = currentTags.filter((tag) => !tagsToRemove.has(tag));

      return this.setTicketTags({
        ticketId,
        tags: remainingTags,
        ...args,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
          per_page: 100,
        },
      };
      let total, count = 0;
      do {
        const results = await fn(args);
        total = results?.length;
        if (!total) {
          return;
        }
        for (const result of results) {
          yield result;
          if (max && ++count >= max) {
            return;
          }
        }
        args.params.page += 1;
      } while (total === args.params.per_page);
    },
    async getPaginatedResources(opts) {
      const results = [];
      for await (const result of this.paginate(opts)) {
        results.push(result);
      }
      return results;
    },
  },
};
