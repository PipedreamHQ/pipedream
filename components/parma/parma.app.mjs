import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "parma",
  propDefinitions: {
    groupIds: {
      type: "string[]",
      label: "Group Ids",
      description: "An array of group Ids.",
      async options() {
        const { data } = await this.listGroups();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    relationshipType: {
      type: "string",
      label: "Type",
      description: "The type of relationship.",
      options: [
        "person",
        "company",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the relationship.",
    },
    relationshipId: {
      type: "string[]",
      label: "Relationship ID",
      description: "The ID of the relationship.",
      async options({ page }) {
        const { data } = await this.listRelationships({
          params: {
            page: page + 1,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.parma.ai/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    createRelationship(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/relationships",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    listRelationships(opts = {}) {
      return this._makeRequest({
        path: "/relationships",
        ...opts,
      });
    },
    addNote(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/notes",
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
        const { data } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
