import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airparser",
  propDefinitions: {
    inboxId: {
      type: "string",
      label: "Inbox ID",
      description: "Identifier of an inbox",
      async options() {
        const inboxes = await this.listInboxes();
        return inboxes?.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "Identifier of the document to extract data from",
      async options({
        inboxId, page,
      }) {
        const { docs } = await this.listDocuments({
          inboxId,
          params: {
            page: page + 1,
          },
        });
        return docs?.map(({
          _id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.airparser.com";
    },
    _headers() {
      return {
        "X-API-Key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    listInboxes(args = {}) {
      return this._makeRequest({
        path: "/inboxes",
        ...args,
      });
    },
    listDocuments({
      inboxId, ...args
    }) {
      return this._makeRequest({
        path: `/inboxes/${inboxId}/docs`,
        ...args,
      });
    },
    getDocument({
      documentId, ...opts
    }) {
      return this._makeRequest({
        path: `/docs/${documentId}/extended`,
        ...opts,
      });
    },
    uploadDocument({
      inboxId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/inboxes/${inboxId}/upload`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      resourceType,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          page: 1,
        },
      };
      let hasMore;
      let count = 0;
      do {
        const response = await resourceFn(args);
        const items = response[resourceType];
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        hasMore = response.hasNextPage;
        args.params.page++;
      } while (hasMore);
    },
  },
};
