import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "clarify",
  propDefinitions: {
    workspace: {
      type: "string",
      label: "Workspace",
      description: "The workspace name.",
      async options() {
        const {
          workspace: {
            name: label,
            slug: value,
          },
        } = await this.getProfile();

        return [
          {
            label,
            value,
          },
        ];
      },
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company.",
    },
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The domain of the company.",
    },
    companyId: {
      type: "string",
      label: "Company",
      description: "The company to be added to a list.",
      async options({
        workspace, prevContext: { offset = 0 },
      }) {
        if ( offset === null ) {
          return [];
        }
        const { data = [] } = this.listCompanies({
          workspace,
          params: {
            offset,
            limit: constants.DEFAULT_LIMIT,
          },
        });

        return {
          options: data.map(({
            attributes: {
              _id: value, name: label,
            },
          }) => ({
            label: label || value,
            value,
          })),
          context: {
            offset: data.length === constants.DEFAULT_LIMIT
              ? offset + constants.DEFAULT_LIMIT
              : null,
          },
        };
      },
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The ID of the person.",
      async options({
        workspace, prevContext: { offset = 0 },
      }) {
        if ( offset === null ) {
          return [];
        }
        const { data = [] } = this.listPeople({
          workspace,
          params: {
            offset,
            limit: constants.DEFAULT_LIMIT,
          },
        });

        return {
          options: data.map(({
            attributes: {
              _id: value, email: label,
            },
          }) => ({
            label: label || value,
            value,
          })),
          context: {
            offset: data.length === constants.DEFAULT_LIMIT
              ? offset + constants.DEFAULT_LIMIT
              : null,
          },
        };
      },
    },
    list: {
      type: "string",
      label: "List",
      description: "The list to add the company to.",
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        debug: true,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    getProfile(args = {}) {
      return this._makeRequest({
        path: "/profile",
        ...args,
      });
    },
    listCompanies({
      workspace, ...args
    } = {}) {
      return this._makeRequest({
        path: `/workspaces/${workspace}/objects/${constants.OBJECT_ENTITY.COMPANY}/records`,
        ...args,
      });
    },
    listPeople({
      workspace, ...args
    } = {}) {
      return this._makeRequest({
        path: `/workspaces/${workspace}/objects/${constants.OBJECT_ENTITY.PERSON}/records`,
        ...args,
      });
    },
  },
};
