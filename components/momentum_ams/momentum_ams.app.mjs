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
      async options({ page }) {
        const response = await this.getClients({
          params: {
            "$top": 10,
            "$skip": page * 10,
            "$orderby": "id",
          },
        });
        return response.value.map(({
          id, commercialName,
        }) => ({
          value: id,
          label: commercialName,
        }));
      },
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
        path: "/Zapier/InsertNote",
        method: "post",
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

    async getClients(args = {}) {
      return this._makeRequest({
        path: "/InsuredDetailList",
        ...args,
      });
    },
  },
};
