import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mailosaur",
  propDefinitions: {
    serverId: {
      type: "string",
      label: "Server ID",
      description: "The identifier of the Mailosaur server.",
      async options() {
        const servers = await this.listServers();
        return servers.map((server) => ({
          label: server.name,
          value: server.id,
        }));
      },
    },
    emailId: {
      type: "string",
      label: "Email ID",
      description: "The identifier of the email to be managed.",
    },
    to: {
      type: "string",
      label: "To",
      description:
        "The verified external email address to which the email should be sent.",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject line for an email.",
    },
    from: {
      type: "string",
      label: "From",
      description:
        "Optionally overrides the message’s ‘from’ address. This must be an address ending with `YOUR_SERVER.mailosaur.net`.",
      optional: true,
    },
    html: {
      type: "string",
      label: "HTML",
      description: "HTML content for the email.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Plain text content for the email.",
      optional: true,
    },
    send: {
      type: "boolean",
      label: "Send",
      description:
        "If not `true`, the email will be created in your server, but will not be sent.",
      optional: true,
    },
    attachments: {
      type: "string[]",
      label: "Attachments",
      description:
        "An object array of base64-encoded attachment objects (`fileName`, `contentType`, `content`).",
      optional: true,
    },
    receiveAfter: {
      type: "string",
      label: "Receive After",
      description:
        "Limits results to only messages received after this date/time.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Used in conjunction with `itemsPerPage` to support pagination.",
      optional: true,
    },
    itemsPerPage: {
      type: "integer",
      label: "Items Per Page",
      description:
        "A limit on the number of results to be returned per page. Can be set between 1 and 1000 items, default is 50.",
      optional: true,
    },
    dir: {
      type: "string",
      label: "Direction",
      description: "Optionally limits results based on the direction (`Sent` or `Received`).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://mailosaur.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listServers(opts = {}) {
      return this._makeRequest({
        path: "/servers",
        ...opts,
      });
    },
    async listMessages(opts = {}) {
      return this._makeRequest({
        path: "/messages",
        ...opts,
      });
    },
    async sendEmail(opts = {}) {
      const {
        serverId, to, subject, from, html, text, send, attachments,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: `/messages?server=${serverId}`,
        data: {
          to,
          from,
          subject,
          html,
          text,
          send,
          attachments,
        },
      });
    },
    async searchMessages(opts = {}) {
      const {
        serverId, receiveAfter, page, itemsPerPage, dir, ...criteria
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: `/messages/search?server=${serverId}`,
        data: criteria,
        params: {
          receiveAfter,
          page,
          itemsPerPage,
          dir,
        },
      });
    },
    async deleteEmail(opts = {}) {
      const { emailId } = opts;
      return this._makeRequest({
        method: "DELETE",
        path: `/messages/${emailId}`,
      });
    },
    async paginate(fn, ...opts) {
      let allItems = [];
      let currentPage = 1;
      let items;

      do {
        items = await fn({
          ...opts,
          page: currentPage,
        });
        allItems = allItems.concat(items.items || items);
        currentPage++;
      } while (items.length > 0);

      return allItems;
    },
  },
};
