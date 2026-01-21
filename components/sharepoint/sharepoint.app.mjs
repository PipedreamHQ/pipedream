import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sharepoint",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "SharePoint Site",
      async options() {
        return this.getSites();
      },
    },
    listId: {
      type: "string",
      label: "List / Document Library",
      async options({ siteId }) {
        if (!siteId) {
          return [];
        }
        return this.getLists(siteId);
      },
    },
  },
  methods: {
    _getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    async _makeRequest({ path, ...args }) {
      return axios(this, {
        url: `https://graph.microsoft.com/v1.0/${path}`,
        headers: {
          "Authorization": `Bearer ${this._getAccessToken()}`,
        },
        ...args,
      });
    },
    async getSites() {
      try {
        const sites = await this._makeRequest({
          path: "sites?search=",
        });
        return sites.value.map((site) => ({
          label: site.displayName,
          value: site.id,
        }));
      } catch (e) {
        try {
          const rootSite = await this._makeRequest({
            path: "sites/root",
          });
          return [
            {
              label: rootSite.displayName,
              value: rootSite.id,
            },
          ];
        } catch (e2) {
          console.error("Could not list any sites.", e2.response?.data || e2);
          return [];
        }
      }
    },
    async getLists(siteId) {
      if (!siteId) return [];
      const lists = await this._makeRequest({
        path: `sites/${siteId}/lists`,
        params: {
          $filter: "hidden eq false",
          $select: "id,displayName,name",
        },
      });
      return lists.value.map((list) => ({
        label: list.displayName,
        value: list.id,
      }));
    },
    async getListColumns(siteId, listId) {
      if (!siteId || !listId) return [];
      const response = await this._makeRequest({
        path: `sites/${siteId}/lists/${listId}/columns`,
      });

      if (!response.value) {
        return [];
      }

      return response.value
        .filter((c) => !c.readOnly && c.name)
        .map((c) => ({
          label: `${c.displayName} (${c.name})`,
          value: c.name,
        }));
    },
  },
};