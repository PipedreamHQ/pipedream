import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "zendesk",
  propDefinitions: {
    categoryId: {
      type: "string",
      label: "Trigger Category ID",
      description: "The ID of the trigger category. [See the docs here](https://developer.zendesk.com/api-reference/ticketing/business-rules/trigger_categories/#list-trigger-categories)",
      optional: true,
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
    viewId: {
      type: "string",
      label: "View ID",
      description: "The ID of the view",
      async options({ prevContext }) {
        const { afterCursor } = prevContext;

        const {
          views,
          meta,
        } =
          await this.listViews({
            params: {
              [constants.PAGE_SIZE_PARAM]: constants.DEFAULT_LIMIT,
              [constants.PAGE_AFTER_PARAM]: afterCursor,
            },
          });

        return {
          context: {
            afterCursor: meta.after_cursor,
          },
          options: views.map(({
            id, title,
          }) => ({
            label: title || `View #${id}`,
            value: id,
          })),
        };
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Ticket fields to be included in the incoming webhook payload",
      withLabel: true,
      optional: true,
      async options() {
        // placehoders reference - https://support.zendesk.com/hc/en-us/articles/4408886858138
        const { ticket_fields: customFields } = await this.listTicketFields();
        const fields = customFields.reverse().map(({
          id, title,
        }) => ({
          label: title,
          value: `{{ticket.ticket_field_${id}}}`,
        }));
        fields.push(...constants.TICKET_FIELD_OPTIONS);
        return fields;
      },
    },
    ticketCommentBody: {
      type: "string",
      label: "Comment body",
      description: "The body of the comment.",
    },
    ticketCommentBodyIsHTML: {
      type: "boolean",
      label: "Comment body is HTML",
      description: "Whether the comment body is HTML. Default is `false`, which expects Markdown",
      default: false,
      optional: true,
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
    ticketCommentPublic: {
      type: "boolean",
      label: "Comment Public",
      description: "Whether the comment is public. Default is `true`",
      default: true,
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field to sort tickets by",
      optional: true,
      options: constants.SORT_BY_OPTIONS,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort order (ascending or descending)",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of tickets to return",
      optional: true,
      default: 100,
    },
    customSubdomain: {
      type: "string",
      label: "Custom Subdomain",
      description: "For Enterprise Zendesk accounts: optionally specify the subdomain to use. This will override the subdomain that was provided when connecting your Zendesk account to Pipedream. For example, if you Zendesk URL is https://examplehelp.zendesk.com, your subdomain is `examplehelp`",
      optional: true,
    },
    ticketTags: {
      type: "string[]",
      label: "Tags",
      description: "Array of tags to apply to the ticket. These will replace any existing tags on the ticket.",
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
    getTicketInfo({
      ticketId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/tickets/${ticketId}`,
        ...args,
      });
    },
    searchTickets(args = {}) {
      return this.makeRequest({
        path: "/search",
        ...args,
      });
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
    listViews(args = {}) {
      return this.makeRequest({
        path: "/views",
        ...args,
      });
    },
    listTicketsInView({
      viewId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/views/${viewId}/tickets`,
        ...args,
      });
    },
    listTicketFields(args = {}) {
      return this.makeRequest({
        path: "/ticket_fields",
        ...args,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          per_page: constants.DEFAULT_LIMIT,
          page: 1,
        },
      };
      let hasMore = true;
      let count = 0;
      while (hasMore) {
        const response = await fn(args);
        const items = resourceKey
          ? response[resourceKey]
          : response;
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = !!response.next_page;
        args.params.page += 1;
      }
    },
    /**
     * Set tags on a ticket (replaces all existing tags)
     * @param {object} args - Arguments object
     * @param {string} args.ticketId - The ticket ID
     * @param {string[]} args.tags - Array of tags to set
     * @param {string} args.customSubdomain - Optional custom subdomain
     * @returns {Promise<object>} API response
     */
    setTicketTags({
      ticketId, tags, customSubdomain, ...args
    }) {
      return this.makeRequest({
        method: "POST",
        path: `/tickets/${ticketId}/tags.json`,
        customSubdomain,
        data: {
          tags,
        },
        ...args,
      });
    },
    /**
     * Add tags to a ticket (appends to existing tags)
     * @param {object} args - Arguments object
     * @param {string} args.ticketId - The ticket ID
     * @param {string[]} args.tags - Array of tags to add
     * @param {string} args.customSubdomain - Optional custom subdomain
     * @returns {Promise<object>} API response
     */
    addTicketTags({
      ticketId, tags, customSubdomain, ...args
    }) {
      return this.makeRequest({
        method: "PUT",
        path: `/tickets/${ticketId}/tags.json`,
        customSubdomain,
        data: {
          tags,
        },
        ...args,
      });
    },
    /**
     * Remove specific tags from a ticket
     * @param {object} args - Arguments object
     * @param {string} args.ticketId - The ticket ID
     * @param {string[]} args.tags - Array of tags to remove
     * @param {string} args.customSubdomain - Optional custom subdomain
     * @returns {Promise<object>} API response
     */
    removeTicketTags({
      ticketId, tags, customSubdomain, ...args
    }) {
      return this.makeRequest({
        method: "DELETE",
        path: `/tickets/${ticketId}/tags.json`,
        customSubdomain,
        data: {
          tags,
        },
        ...args,
      });
    },
  },
};
