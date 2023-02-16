import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "laposta",
  propDefinitions: {
    listId: {
      label: "List ID",
      description: "The list ID",
      type: "string",
      async options() {
        const lists = await this.getLists();

        return lists.map(({ list }) => ({
          label: list.name,
          value: list.list_id,
        }));
      },
    },
    relationId: {
      label: "Relation ID",
      description: "The relation ID",
      type: "string",
      async options({ listId }) {
        const relations = await this.getRelations({
          params: {
            list_id: listId,
          },
        });

        return relations.map(({ member }) => ({
          label: member.email,
          value: member.member_id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.laposta.nl/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._apiKey(),
          password: "",
        },
        ...args,
      });
    },
    async createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhook",
        method: "post",
        ...args,
      });
    },
    async removeWebhook({
      webhookId, ...args
    }) {
      return this._makeRequest({
        path: `/webhook/${webhookId}`,
        method: "delete",
        ...args,
      });
    },
    async getLists(args = {}) {
      const { data } = await this._makeRequest({
        path: "/list",
        ...args,
      });

      return data;
    },
    async getRelations(args = {}) {
      const { data } = await this._makeRequest({
        path: "/member",
        ...args,
      });

      return data;
    },
    async createRelation(args = {}) {
      return await this._makeRequest({
        path: "/member",
        method: "post",
        ...args,
      });
    },
    async updateRelation({
      relationId, ...args
    }) {
      return await this._makeRequest({
        path: `/member/${relationId}`,
        method: "post",
        ...args,
      });
    },
    async deleteRelation({
      relationId, ...args
    }) {
      return await this._makeRequest({
        path: `/member/${relationId}`,
        method: "delete",
        ...args,
      });
    },
  },
};
