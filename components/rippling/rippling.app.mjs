import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rippling",
  propDefinitions: {
    workerId: {
      type: "string",
      label: "Worker ID",
      description: "The ID of the worker",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext?.next,
          }
          : {};
        const {
          results, next_link: next,
        } = await this.listWorkers(args);
        return {
          options: results?.map(({
            id: value, personal_info,
          }) => ({
            label: `${personal_info.first_name} ${personal_info.last_name}`,
            value,
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the team",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext?.next,
          }
          : {};
        const {
          results, next_link: next,
        } = await this.listTeams(args);
        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext?.next,
          }
          : {};
        const {
          results, next_link: next,
        } = await this.listCompanies(args);
        return {
          options: results?.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
      async options({ prevContext }) {
        const args = prevContext?.next
          ? {
            url: prevContext?.next,
          }
          : {};
        const {
          results, next_link: next,
        } = await this.listUsers(args);
        return {
          options: results?.map(({
            id: value, display_name: label,
          }) => ({
            label,
            value,
          })) || [],
          context: {
            next,
          },
        };
      },
    },
    filterWorkers: {
      type: "string",
      label: "Filter",
      description: "Filter workers by field. Filterable fields: `status`, `work_email`, `user_id`, `created_at`, `updated_at`. Example: `status+eq+'ACTIVE'` [See the documentation](https://developer.rippling.com/documentation/rest-api/guides/query-parameters#filter) for more information.",
      optional: true,
    },
    expandWorkers: {
      type: "string[]",
      label: "Expand",
      description: "Expand fields",
      options: [
        "user",
        "manager",
        "legal_entity",
        "employment_type",
        "compensation",
        "department",
        "teams",
        "level",
        "custom_fields",
        "business_partners",
      ],
      optional: true,
    },
    expandCompanies: {
      type: "string[]",
      label: "Expand",
      description: "Expand fields",
      options: [
        "parent_legal_entity",
        "legal_entities",
      ],
      optional: true,
    },
    expandTeams: {
      type: "string[]",
      label: "Expand",
      description: "Expand fields",
      options: [
        "parent",
      ],
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "The field to order the results by",
      options: [
        "id",
        "created_at",
        "updated_at",
      ],
      default: "id",
      optional: true,
    },
    orderDirection: {
      type: "string",
      label: "Order Direction",
      description: "The direction to order the results by",
      options: [
        "asc",
        "desc",
      ],
      default: "asc",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  methods: {
    _baseUrl() {
      return "https://rest.ripplingapis.com";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, url, path, headers, ...opts
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    getUser({
      userId, ...opts
    }) {
      return this._makeRequest({
        path: `/users/${userId}`,
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        path: "/teams",
        ...opts,
      });
    },
    listWorkers(opts = {}) {
      return this._makeRequest({
        path: "/workers",
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      let hasMore, count = 0;
      do {
        const {
          results, next_link: next,
        } = await fn(args);
        if (!results?.length) {
          return;
        }
        for (const item of results) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = next;
        args.url = next;
      } while (hasMore);
    },
    async getPaginatedResources(opts) {
      const results = [];
      const resources = this.paginate(opts);
      for await (const resource of resources) {
        results.push(resource);
      }
      return results;
    },
  },
};
