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
  },
  methods: {
    getUrl(url, path, versionPath) {
      const { region } = this.$auth;
      return url || `${constants.BASE_PREFIX_URL}${region}${versionPath}${path}`;
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
      headers: preHeaders,
      params,
      data: preData,
      versionPath = constants.VERSION_PATH,
      withRetries = true,
      ...args
    } = {}) {
      const contentType = constants.CONTENT_TYPE_KEY_HEADER;

      const hasMultipartHeader = utils.hasMultipartHeader(preHeaders);
      const data = hasMultipartHeader && utils.getFormData(preData) || preData;

      const currentHeaders = this.getHeaders(preHeaders);
      const headers = hasMultipartHeader
        ? {
          ...currentHeaders,
          [contentType]: data.getHeaders()[contentType.toLowerCase()],
        }
        : currentHeaders;

      const config = {
        headers,
        url: this.getUrl(url, path, versionPath),
        params: this.getParams(url, params),
        data,
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
