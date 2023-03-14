import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zendesk",
  propDefinitions: {
    categoryId: {
      type: "string",
      label: "Trigger category ID",
      description: "The ID of the trigger category. [See the docs here](https://developer.zendesk.com/api-reference/ticketing/business-rules/trigger_categories/#list-trigger-categories)",
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          trigger_categories: categories,
          meta,
        } =
          await this.listTriggerCategories({
            params: {
              [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
              sort: constants.SORT_BY_POSITION_ASC,
              [constants.PAGE_AFTER_PARAM]: afterCursor,
            },
          });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: categories.map(({
            id, name,
          }) => ({
            label: name,
            value: id,
          })),
        };
      },
    },
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of the ticket.",
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          tickets,
          meta,
        } =
          await this.listTickets({
            params: {
              [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
              sort: constants.SORT_BY_UPDATED_AT_DESC,
              [constants.PAGE_AFTER_PARAM]: afterCursor,
            },
          });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: tickets.map(({
            id, subject,
          }) => ({
            label: subject || `Ticket #${id}`,
            value: id,
          })),
        };
      },
    },
    ticketCommentBody: {
      type: "string",
      label: "Comment body",
      description: "The body of the comment.",
    },
    ticketPriority: {
      type: "string",
      label: "Ticket Priority",
      description: "The priority of the ticket.",
      optional: true,
      options: Object.values(constants.TICKET_PRIORITY_OPTIONS),
    },
    ticketSubject: {
      type: "string",
      label: "Ticket Subject",
      description: "The subject of the ticket.",
      optional: true,
    },
    ticketStatus: {
      type: "string",
      label: "Ticket Status",
      description: "The status of the ticket.",
      optional: true,
      options: Object.values(constants.TICKET_STATUS_OPTIONS),
    },
    customSubdomain: {
      type: "string",
      label: "Custom Subdomain",
      description: "For Enterprise Zendesk accounts: optionally specify the subdomain to use. This will override the subdomain that was provided when connecting your Zendesk account to Pipedream.",
      optional: true,
    },
  },
  methods: {
    getUrl(path, customSubdomain) {
      const {
        SUBDOMAIN_PLACEHOLDER,
        BASE_URL,
        VERSION_PATH,
      } = constants;
      const baseUrl = BASE_URL.replace(
        SUBDOMAIN_PLACEHOLDER,
        customSubdomain?.trim() || this.$auth.subdomain,
      );
      return `${baseUrl}${VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, url, path, headers, customSubdomain, ...args
    }) {
      const config = {
        headers: this.getHeaders(headers),
        url: url ?? this.getUrl(path, customSubdomain),
        timeout: constants.DEFAULT_TIMEOUT,
        ...args,
      };
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    listTriggerCategories(args = {}) {
      return this.makeRequest({
        path: "/trigger_categories",
        ...args,
      });
    },
    listTickets(args = {}) {
      return this.makeRequest({
        path: "/tickets",
        ...args,
      });
    },
  },
};
