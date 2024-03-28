import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "teamioo",
  propDefinitions: {
    userId: {
      type: "string",
      label: "Assigned User",
      description: "Id of the user assigned to this task.",
      async options() {
        const data = await this.listUsers();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Teamioo tags.",
      async options() {
        const data = await this.listTags();

        return data.map(({ value }) => value);
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group.",
      async options() {
        const groups = await this.listGroups();

        return groups.map(({
          displayName: label, _id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.environment}.teamioo.com/_api`;
    },
    _params(params = {}) {
      return {
        teamiooAPIKey: this.$auth.api_key,
        ...params,
      };
    },
    _makeRequest({
      $ = this, path, params, ...otherOpts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        params: this._params(params),
        ...otherOpts,
      });
    },
    listBookmarks(opts = {}) {
      return this._makeRequest({
        path: "/bookmarks",
        ...opts,
      });
    },
    listClients(opts = {}) {
      return this._makeRequest({
        path: "/clients",
        ...opts,
      });
    },
    listGroupMembers(opts = {}) {
      return this._makeRequest({
        path: "/groupMembers",
        ...opts,
      });
    },
    listGroups() {
      return this._makeRequest({
        path: "/groups",
      });
    },
    listTags() {
      return this._makeRequest({
        path: "/tags",
      });
    },
    listUsers() {
      return this._makeRequest({
        path: "/users",
      });
    },
    createBookmark(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/bookmarks",
        ...opts,
      });
    },
    createEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/calEvents",
        ...opts,
      });
    },
    createTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, lastDate, ...opts
    }) {
      let hasMore = false;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.skip = LIMIT * page;
        page++;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          if (lastDate >= Date.parse(d.addedDate)) break;

          yield d;
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
