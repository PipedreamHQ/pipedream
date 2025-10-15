import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "zoho_desk",
  propDefinitions: {
    orgId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization",
      async options() {
        const { data: organizations } =
          await this.getOrganizations();
        return organizations.map(({
          id: value, companyName: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    portalId: {
      type: "string",
      label: "Portal ID",
      description: "Select the help center portal to target.",
      async options({ orgId }) {
        if (!orgId) {
          return [];
        }
        const { data: helpCenters = [] } =
          await this.listHelpCenters({
            params: {
              orgId,
            },
          });
        return helpCenters.map(({
          portalId: value,
          name: label,
        }) => ({
          value,
          label: label || value,
        }));
      },
    },
    departmentId: {
      type: "string",
      label: "Department ID",
      description: "The ID of the department",
      async options(args) {
        return this.getResourcesOptions({
          ...args,
          resourceFn: this.getDepartments,
          resourceMapper: ({
            id: value, name: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options(args) {
        return this.getResourcesOptions({
          ...args,
          resourceFn: this.getContacts,
          resourceMapper: ({
            id: value, lastName: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of the ticket",
      async options(args) {
        return this.getResourcesOptions({
          ...args,
          resourceFn: this.getTickets,
          resourceMapper: ({
            id: value, subject: label,
          }) => ({
            value,
            label,
          }),
        });
      },
    },
    supportEmailAddress: {
      type: "string",
      label: "Support Email Address",
      description: "Support email address configured in your help desk",
      async options(args) {
        return this.getResourcesOptions({
          ...args,
          resourceFn: this.getSupportEmailAddresses,
          resourceMapper: ({ address }) => address,
        });
      },
    },
    ticketStatus: {
      type: "string",
      label: "Status",
      description: "Status of the ticket",
      async options() {
        const { data: fields = [] } =
          await this.getOrganizationFields({
            params: {
              module: "tickets",
              apiNames: "status",
            },
          });
        const { allowedValues = [] } = fields[0] || {};
        return allowedValues.map(({ value }) => value);
      },
    },
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The ID of the knowledge base article.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: `Maximum number of results to return. Set to blank to return everything.`,
      optional: true,
      default: constants.MAX_RESOURCES,
    },
  },
  methods: {
    getUrl(url, path, apiPrefix) {
      const { region } = this.$auth;
      return url || `${constants.BASE_PREFIX_URL}${region}${apiPrefix}${path}`;
    },
    getHeaders(headers) {
      const { oauth_access_token: oauthAccessToken } = this.$auth;
      const authorization = `${constants.TOKEN_PREFIX} ${oauthAccessToken}`;
      return {
        Authorization: authorization,
        ...constants.DEFAULT_HEADERS,
        ...headers,
      };
    },
    getParams(url, params) {
      if (!url) {
        return params;
      }
    },
    async makeRequest({
      $ = this,
      url,
      path,
      params,
      headers,
      apiPrefix = constants.CORE_API_PATH,
      withRetries = true,
      ...args
    } = {}) {
      const config = {
        url: this.getUrl(url, path, apiPrefix),
        params: this.getParams(url, params),
        headers: this.getHeaders(headers),
        ...args,
      };
      try {
        return withRetries
          ? await utils.withRetries(() => axios($, config))
          : await axios($, config);
      } catch (error) {
        console.log("Request error", error.response?.data);
        throw error.response?.data;
      }
    },
    createWebhook(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/webhooks",
        ...args,
      });
    },
    deleteWebhook({
      webhookId, ...args
    }) {
      return this.makeRequest({
        method: "delete",
        path: `/webhooks/${webhookId}`,
        ...args,
      });
    },
    getOrganizations(args = {}) {
      return this.makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    createAccount(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/accounts",
        ...args,
      });
    },
    createContact(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/contacts",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    } = {}) {
      return this.makeRequest({
        method: "patch",
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
    searchContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts/search",
        ...args,
      });
    },
    getDepartments(args = {}) {
      return this.makeRequest({
        path: "/departments",
        ...args,
      });
    },
    createTicket(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/tickets",
        ...args,
      });
    },
    updateTicket({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        method: "patch",
        path: `/tickets/${ticketId}`,
        ...args,
      });
    },
    createTicketComment({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/tickets/${ticketId}/comments`,
        ...args,
      });
    },
    getTickets(args = {}) {
      return this.makeRequest({
        path: "/tickets",
        ...args,
      });
    },
    searchTickets(args = {}) {
      return this.makeRequest({
        path: "/tickets/search",
        ...args,
      });
    },
    createTicketAttachment({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/tickets/${ticketId}/attachments`,
        ...args,
      });
    },
    getTicketAttachments({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/tickets/${ticketId}/attachments`,
        ...args,
      });
    },
    getTicketComments({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/tickets/${ticketId}/comments`,
        ...args,
      });
    },
    listHelpCenters(args = {}) {
      return this.makeRequest({
        path: "/helpCenters",
        apiPrefix: constants.PORTAL_API_PATH,
        ...args,
      });
    },
    listKnowledgeBaseArticles(args = {}) {
      return this.makeRequest({
        path: "/kbArticles",
        apiPrefix: constants.PORTAL_API_PATH,
        ...args,
      });
    },
    async *listKnowledgeBaseArticlesStream({
      params,
      max,
      ...args
    } = {}) {
      yield* this.getResourcesStream({
        resourceFn: this.listKnowledgeBaseArticles,
        resourceFnArgs: {
          ...args,
          params,
        },
        max,
      });
    },
    getKnowledgeBaseArticle({
      articleId,
      ...args
    } = {}) {
      return this.makeRequest({
        path: `/kbArticles/${articleId}`,
        apiPrefix: constants.PORTAL_API_PATH,
        ...args,
      });
    },
    searchKnowledgeBaseArticles(args = {}) {
      return this.makeRequest({
        path: "/kbArticles/search",
        apiPrefix: constants.PORTAL_API_PATH,
        ...args,
      });
    },
    async *searchKnowledgeBaseArticlesStream({
      params,
      max,
      ...args
    } = {}) {
      yield* this.getResourcesStream({
        resourceFn: this.searchKnowledgeBaseArticles,
        resourceFnArgs: {
          ...args,
          params,
        },
        max,
      });
    },
    listKnowledgeBaseRootCategories(args = {}) {
      return this.makeRequest({
        path: "/kbRootCategories",
        apiPrefix: constants.PORTAL_API_PATH,
        ...args,
      });
    },
    async *listKnowledgeBaseRootCategoriesStream({
      params,
      max,
      ...args
    } = {}) {
      yield* this.getResourcesStream({
        resourceFn: this.listKnowledgeBaseRootCategories,
        resourceFnArgs: {
          ...args,
          params,
        },
        max,
      });
    },
    sendReply({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        method: "post",
        path: `/tickets/${ticketId}/sendReply`,
        ...args,
      });
    },
    getTicketThreads({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/tickets/${ticketId}/threads`,
        ...args,
      });
    },
    getContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    getSupportEmailAddresses(args = {}) {
      return this.makeRequest({
        path: "/supportEmailAddress",
        ...args,
      });
    },
    getAccounts(args = {}) {
      return this.makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    getAgents(args = {}) {
      return this.makeRequest({
        path: "/agents",
        ...args,
      });
    },
    getOrganizationFields(args = {}) {
      return this.makeRequest({
        path: "/organizationFields",
        ...args,
      });
    },
    async getResourcesOptions({
      orgId, departmentId, prevContext, resourceFn, resourceMapper,
    }) {
      const { from = 1 } = prevContext;
      if (from === null) {
        return [];
      }
      const { data: resources = [] } =
        await resourceFn({
          headers: {
            orgId,
          },
          params: {
            departmentId,
            from,
            limit: constants.DEFAULT_LIMIT,
          },
        });
      const currentLen = resources?.length;
      const options = resources?.map(resourceMapper);
      return {
        options,
        context: {
          from: currentLen
            ? currentLen + from
            : null,
        },
      };
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
      max = constants.MAX_RESOURCES,
    }) {
      let from = 1;
      let resourcesCount = 0;
      let nextResources;

      while (true) {
        try {
          ({ data: nextResources = [] } =
            await resourceFn({
              withRetries: false,
              ...resourceFnArgs,
              params: {
                ...resourceFnArgs.params,
                from,
              },
            }));
        } catch (error) {
          console.log("Stream error", error);
          return;
        }

        if (nextResources?.length < 1) {
          return;
        }

        from += nextResources?.length;

        for (const resource of nextResources) {
          resourcesCount += 1;
          yield resource;
        }

        if (max && resourcesCount >= max) {
          return;
        }
      }
    },
  },
};
