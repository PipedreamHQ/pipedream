import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import languages from "./common/languages.mjs";
import timezones from "./common/timezones.mjs";

export default {
  type: "app",
  app: "gorgias_oauth",
  propDefinitions: {
    customerId: {
      type: "integer",
      label: "Customer ID",
      description: "The ID of a customer",
      async options({ prevContext }) {
        const {
          data: customers,
          meta,
        } = await this.listCustomers({
          params: {
            cursor: prevContext.nextCursor,
          },
        });
        return {
          options: customers.map((customer) => ({
            label: customer.name ?? customer.email,
            value: customer.id,
          })),
          context: {
            nextCursor: meta.next_cursor,
          },
        };
      },
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user assigned to the ticket",
      optional: true,
      async options({ prevContext }) {
        const {
          data: users,
          meta,
        } = await this.listUsers({
          params: {
            cursor: prevContext.nextCursor,
          },
        });
        return {
          options: users.map((user) => ({
            label: user.name,
            value: user.id,
          })),
          context: {
            nextCursor: meta.next_cursor,
          },
        };
      },
    },
    ticketId: {
      type: "integer",
      label: "Ticket ID",
      description: "The ID of a ticket to watch for new messages",
      async options({ prevContext }) {
        const {
          data: tickets,
          meta,
        } = await this.listTickets({
          params: {
            cursor: prevContext.nextCursor,
          },
        });
        return {
          options: tickets.map((ticket) => ({
            label: ticket.subject,
            value: ticket.id,
          })),
          context: {
            nextCursor: meta.next_cursor,
          },
        };
      },
    },
    address: {
      type: "string",
      label: "Address",
      description: "Actual address of the entry. Can be an email, facebook id, phone number, etc",
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel used to send the message. Defaults to `email`",
      optional: true,
      default: "email",
      options: constants.channels,
    },
    via: {
      type: "string",
      label: "Via",
      description: "How the message has been received, or sent from Gorgias. Defaults to `help-center`",
      optional: true,
      default: "help-center",
      options: constants.vias,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "ID of the customer in a foreign system. This field is not used by Gorgias",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The customer's preferred language (format: ISO_639-1)",
      optional: true,
      options: languages,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The customer's preferred timezone (format: IANA timezone name)",
      optional: true,
      options: timezones,
    },
    data: {
      type: "object",
      label: "Customer Data",
      description: "Object containing custom data associated with the customer that will be shown in the helpdesk along with integration data",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number to return",
      optional: true,
    },
    assigneeTeamId: {
      type: "integer",
      label: "Assignee Team ID",
      description: "The ID of the team assigned to the ticket",
      async options({ prevContext }) {
        const {
          data: teams,
          meta,
        } = await this.listTeams({
          params: {
            cursor: prevContext.nextCursor,
          },
        });
        return {
          options: teams.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor: meta.next_cursor,
          },
        };
      },
    },
    assigneeUserId: {
      type: "integer",
      label: "Assignee User ID",
      description: "The ID of the user assigned to the ticket",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the ticket",
    },
  },
  methods: {
    _defaultConfig({
      path, method = "get", params = {}, data,
    }) {
      const config = {
        url: `https://${this.$auth.domain}.gorgias.com/api/${path}`,
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        method,
        params,
        data,
      };
      return config;
    },
    async _makeRequest({
      $, path, method, params, data,
    }) {
      try {
        const config = this._defaultConfig({
          path,
          method,
          params,
          data,
        });
        const response = await axios($ ?? this, config);
        return response;
      } catch (e) {
        const errorMsg = JSON.stringify(e.response.data);
        throw new Error(errorMsg);
      }
    },
    async *paginate({
      $, fn, params = {}, cursor,
    }) {
      const { limit } = params;
      let count = 0;

      do {
        const {
          data,
          meta,
        } = await fn({
          $,
          params: {
            ...params,
            cursor,
          },
        });

        for (const d of data) {
          yield d;

          if (limit && ++count === limit) {
            return count;
          }
        }

        cursor = meta.next_cursor;
      } while (cursor);
    },
    async createWebhook({
      url,
      eventType,
    }) {
      return this._makeRequest({
        path: "integrations",
        method: "post",
        data: {
          name: `pipedream-${url}`,
          type: "http",
          http: {
            url,
            method: "POST",
            request_content_type: "application/json",
            response_content_type: "application/json",
            form: "{{context}}",
            triggers: {
              [eventType]: true,
            },
          },
        },
      });
    },
    async deleteWebhook({ id }) {
      return this._makeRequest({
        path: `integrations/${id}`,
        method: "delete",
      });
    },
    async getEvents({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "events",
        params,
      });
    },
    async createCustomer({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "customers",
        method: "post",
        data,
      });
    },
    async updateCustomer({
      $, id, data,
    }) {
      return this._makeRequest({
        $,
        path: `customers/${id}`,
        method: "put",
        data,
      });
    },
    async retrieveCustomer({
      $, id,
    }) {
      return this._makeRequest({
        $,
        path: `customers/${id}`,
      });
    },
    async listCustomers({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "customers",
        params,
      });
    },
    async createTicket({
      $, data,
    }) {
      return this._makeRequest({
        $,
        path: "tickets",
        method: "post",
        data,
      });
    },
    async listTickets({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "tickets",
        params,
      });
    },
    async retrieveTicket({
      $, id,
    }) {
      return this._makeRequest({
        $,
        path: `tickets/${id}`,
      });
    },
    async updateTicket({
      ticketId,
      ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tickets/${ticketId}`,
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        path: "/teams",
        ...opts,
      });
    },
  },
};
