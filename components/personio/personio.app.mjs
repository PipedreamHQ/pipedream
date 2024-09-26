import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";
import { clearObj } from "./common/utils.mjs";

export default {
  type: "app",
  app: "personio",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The e-mail field is required for the employee creation. Updating of this field is not currently supported.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the employee.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the employee.",
    },
    supervisorId: {
      type: "string",
      label: "Supervisor Id",
      description: "Employee ID of the Supervisor to be assigned. It needs to belong to a current existing employee, otherwise an error will be returned. If not present, no supervisor will be assigned.",
      async options({ page }) {
        const { data } = await this.listEmployees({
          params: {
            offset: LIMIT * page,
            limit: LIMIT,
          },
        });

        return data.map(({ attributes }) => {
          const {
            id, email,
          } = attributes;

          return {
            label: email.value,
            value: id.value,
          };
        });
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.personio.de/v1";
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, headers, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      };

      return axios($, clearObj(config));
    },
    createApplication(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "recruiting/applications",
        ...args,
      });
    },
    createEmployee(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "company/employees",
        ...args,
      });
    },
    listEmployees(args = {}) {
      return this._makeRequest({
        path: "company/employees",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = `${page * LIMIT}`;
        page++;
        const { data } = await fn({
          params,
        });

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length === LIMIT;

      } while (hasMore);
    },
  },
};
