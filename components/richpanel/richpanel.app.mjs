import { axios } from "@pipedream/platform";
import {
  COMMENT_SENDER_TYPE_OPTIONS,
  STATUS_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "richpanel",
  propDefinitions: {
    createId: {
      type: "string",
      label: "Ticket ID",
      description: "The ID of the ticket to create",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ticket",
      options: STATUS_OPTIONS,
    },
    commentBody: {
      type: "string",
      label: "Comment Body",
      description: "The body of the comment for the ticket",
    },
    commentSenderType: {
      type: "string",
      label: "Comment Sender Type",
      description: "The sender type of the comment",
      options: COMMENT_SENDER_TYPE_OPTIONS,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the new ticket.",
      async options() {
        const { tag } = await this.listTags();

        return tag.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    conversationId: {
      type: "string",
      label: "Ticket ID",
      description: "ID of the ticket to update",
      async options({ page }) {
        const { ticket } = await this.listTickets({
          params: {
            page: page + 1,
          },
        });

        console.log("ticket: ", ticket);

        return ticket.map(({
          id: value, subject: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.richpanel.com/v1";
    },
    _headers() {
      return {
        "x-richpanel-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createTicket(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tickets",
        ...opts,
      });
    },
    listTags() {
      return this._makeRequest({
        path: "/tags",
      });
    },
    listTickets(opts = {}) {
      return this._makeRequest({
        path: "/tickets",
        ...opts,
      });
    },
    updateTicket({
      conversationId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/tickets/${conversationId}`,
        ...opts,
      });
    },

    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const { ticket } = await fn({
          params,
          ...opts,
        });

        if (!ticket) {
          return;
        }

        for (const d of ticket) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = ticket && ticket.length;

      } while (hasMore);
    },
  },
};
