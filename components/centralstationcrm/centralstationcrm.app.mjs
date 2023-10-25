import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "centralstationcrm",
  propDefinitions: {
    responsibleUserId: {
      type: "string",
      label: "Responsible User",
      description: "Identifier of the responsible user",
      optional: true,
      async options({ page }) {
        const users = await this.listUsers({
          params: {
            page: page + 1,
            active: "true",
          },
        });
        return users?.map(({ user }) => ({
          value: user.id,
          label: `${user.first} ${user.name}`,
        })) || [];
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tags",
      description: "Tags to add to add to the person",
      async options({ page }) {
        const tags = await this.listTags({
          params: {
            page: page + 1,
          },
        });
        return tags?.map(({ tag }) => ({
          value: tag.id,
          label: tag.name,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.account_name}.centralstationcrm.net/api`;
    },
    _headers() {
      return {
        "X-apikey": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users.json",
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "/tags.json",
        ...args,
      });
    },
    createPerson(args = {}) {
      return this._makeRequest({
        path: "/people.json",
        method: "POST",
        ...args,
      });
    },
  },
};
