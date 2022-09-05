import { axios } from "@pipedream/platform";
import parser from "xml2json-light";

export default {
  type: "app",
  app: "estreamdesk",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return `${this.$auth.domain}/api`;
    },
    _getHeaders() {
      return {
        "apiKey": `${this._apiKey()}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...otherConfig
    }) {
      const config = {
        url: `${this._getBaseUrl()}/${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      };

      return axios($, config);
    },
    async listTickets({ ...args } = {}) {
      const response = await this._makeRequest({
        path: "tickets",
        ...args,
      });

      const {
        Response:
          { Tickets },
      } = parser.xml2json(response);
      let { Ticket } = Tickets;

      if (!Ticket) return Tickets;
      if (!Array.isArray(Ticket)) Ticket = [
        Ticket,
      ];
      Tickets.Ticket = Ticket.reverse();
      return Tickets;
    },
    async *paginate({
      $, fn, params = {}, limit = null,
    }) {
      let count = 0;
      let maxPage = 0;
      let page = 1;

      do {
        let {
          Ticket, TotalPages,
        } = await fn({
          $,
          params: {
            ...params,
            page,
          },
        });

        if (!Ticket) return;

        maxPage = TotalPages;

        if (limit) Ticket = Ticket.slice(-limit);

        for (const d of Ticket) {
          yield d;

          if (limit && ++count === limit) {
            return false;
          }
        }
      } while (page < maxPage);
    },
  },
};
