import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "momentum_ams",
  propDefinitions: {
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject or title for the note",
    },
    creatorName: {
      type: "string",
      label: "Creator Name",
      description: "The name of the user creating the note",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "A category to classify the note",
      optional: true,
    },
    isStickyNote: {
      type: "boolean",
      label: "Is Sticky Note",
      description: "Set to true to make this note a sticky note for higher visibility",
      optional: true,
    },
    hide: {
      type: "boolean",
      label: "Hide",
      description: "Set to true to archive or hide the note from the default view",
      optional: true,
    },
    id: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      async options({
        count, orderby, skip, top,
      }) {
        const response = await this.getClients({
          count,
          orderby,
          skip,
          top,
        });
        const ids = response.value;
        return ids.map(({
          id, commercialName,
        }) => ({
          value: id,
          label: commercialName,
        }));
      },
    },
    count: {
      type: "boolean",
      label: "Count",
      description: "Returns the total number of records that exist in nowcerts database",
    },
    orderby: {
      type: "string",
      label: "Order By",
      description: "The parameter used to sort the results, e.g.: `firstName`, `changeDate`)",
    },
    skip: {
      type: "integer",
      label: "Skip",
      description: "The number of records to skip for pagination purposes",
    },
    top: {
      type: "integer",
      label: "Top",
      description: "The maximum number of records to retrieve for pagination purposes",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.nowcerts.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
      });
    },

    async insertNote(args = {}) {
      return this._makeRequest({
        path: "/InsertNote",
        ...args,
      });
    },
    async getClient({
      id, ...args
    }) {
      return this._makeRequest({
        path: `/InsuredList(${id})`,
        ...args,
      });
    },
    async getClients({
      count, orderby, skip, top, ...args
    }) {
      return this._makeRequest({
        path: "/InsuredDetailList",
        params: {
          "$count": count,
          "$orderby": orderby,
          "$skip": skip,
          "$top": top,
        },
        ...args,
      });
    },
  },
};
