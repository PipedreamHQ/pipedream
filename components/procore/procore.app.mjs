import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "procore",
  propDefinitions: {
    companyId: {
      type: "integer",
      label: "Company ID",
      description: "Select the company to watch for changes in.",
      async options({ page }) {
        const results =
          await this.listCompanies({
            params: {
              per_page: constants.DEFAULT_LIMIT,
              page,
            },
          });
        return results.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectId: {
      type: "integer",
      label: "Project ID",
      description:
        "Select the project to watch for changes in. Leave blank for company-level resources (eg. Projects).",
      optional: true,
      async options({
        page, companyId,
      }) {
        const results = await this.listProjects({
          headers: this.companyHeader(companyId),
          params: {
            company_id: companyId,
            per_page: constants.DEFAULT_LIMIT,
            page,
          },
        });
        return results.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    userId: {
      type: "integer",
      label: "User ID",
      description: "The ID of the user to watch for changes in.",
      async options({
        page, companyId,
      }) {
        const results = await this.listUsers({
          companyId,
          headers: this.companyHeader(companyId),
          params: {
            per_page: constants.DEFAULT_LIMIT,
            page,
          },
        });
        return results.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    resourceName: {
      type: "string",
      label: "Resource",
      description: "The type of resource on which to trigger events.",
      options: Object.values(constants.RESOURCE_NAMES),
    },
    eventTypes: {
      type: "string[]",
      label: "Event Type",
      description: "Only events of the selected event type will be emitted.",
      options: Object.values(constants.EVENT_TYPES),
    },
  },
  methods: {
    _getUrl({
      env = constants.ENV.PROD, apiVersion = constants.API_VERSION.DEFAULT, path,
    } = {}) {
      const baseUrl = constants.BASE_URL
        .replace(constants.ENV_PLACEHOLDER, env);
      const versionPath = constants.VERSION_PATH
        .replace(constants.API_VERSION_PLACEHOLDER, apiVersion);
      return `${baseUrl}${versionPath}${path}`;
    },
    _getHeaders(headers) {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    companyHeader(companyId) {
      return {
        ["Procore-Company-Id"]: companyId,
      };
    },
    makeRequest({
      step = this, env, apiVersion, path, headers: preHeaders, data: preData, ...args
    } = {}) {
      const contentType = constants.CONTENT_TYPE_KEY_HEADER;
      const hasMultipartHeader = utils.hasMultipartHeader(preHeaders);
      const data = hasMultipartHeader && utils.getFormData(preData) || preData;

      const currentHeaders = this._getHeaders(preHeaders);
      const headers = hasMultipartHeader
        ? {
          ...currentHeaders,
          [contentType]: data.getHeaders()[contentType.toLowerCase()],
        }
        : currentHeaders;

      const url = this._getUrl({
        env,
        apiVersion,
        path,
      });

      const config = {
        url,
        headers,
        data,
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
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    listCompanies(args = {}) {
      return this.makeRequest({
        path: "/companies",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this.makeRequest({
        apiVersion: constants.API_VERSION.V11,
        path: "/projects",
        ...args,
      });
    },
    listUsers({
      companyId, ...args
    } = {}) {
      return this.makeRequest({
        apiVersion: constants.API_VERSION.V11,
        path: `/companies/${companyId}/users`,
        ...args,
      });
    },
  },
};
