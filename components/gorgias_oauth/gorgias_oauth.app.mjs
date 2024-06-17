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
      optional: true,
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
      optional: true,
    },
    assigneeUserId: {
      type: "integer",
      label: "Assignee User ID",
      description: "The ID of the user assigned to the ticket",
      optional: true,
    },
    closedDatetime: {
      type: "string",
      label: "Closed Datetime",
      description: "When the ticket was closed (ISO 8601 format)",
      optional: true,
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email of the customer linked to the ticket",
      optional: true,
    },
    fromAgent: {
      type: "boolean",
      label: "From Agent",
      description: "Whether the first message of the ticket was sent by your company to a customer, or the opposite",
      optional: true,
    },
    isUnread: {
      type: "boolean",
      label: "Is Unread",
      description: "Whether the ticket is unread for you",
      optional: true,
    },
    spam: {
      type: "boolean",
      label: "Spam",
      description: "Whether the ticket is considered as spam or not",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ticket. Default: `open`",
      options: [
        "open",
        "closed",
      ],
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the ticket",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags linked to the ticket",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}.gorgias.com/api`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    async listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    async listTickets(opts = {}) {
      return this._makeRequest({
        path: "/tickets",
        ...opts,
      });
    },
    async updateTicket({
      ticketId,
      assigneeTeamId,
      assigneeUserId,
      channel,
      closedDatetime,
      customerId,
      customerEmail,
      externalId,
      fromAgent,
      isUnread,
      language,
      spam,
      status,
      subject,
      tags,
      ...opts
    }) {
      const data = {
        assignee_team: assigneeTeamId
          ? {
            id: assigneeTeamId,
          }
          : undefined,
        assignee_user: assigneeUserId
          ? {
            id: assigneeUserId,
          }
          : undefined,
        channel,
        closed_datetime: closedDatetime,
        customer: customerId
          ? {
            id: customerId,
            email: customerEmail,
          }
          : undefined,
        external_id: externalId,
        from_agent: fromAgent,
        is_unread: isUnread,
        language,
        spam,
        status,
        subject,
        tags: tags
          ? tags.map((tag) => ({
            name: tag,
          }))
          : undefined,
      };

      return this._makeRequest({
        method: "PUT",
        path: `/tickets/${ticketId}`,
        data,
        ...opts,
      });
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
    async retrieveTicket({
      $, id,
    }) {
      return this._makeRequest({
        $,
        path: `tickets/${id}`,
      });
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
  },
  version: "0.0.{{ts}}",
};
