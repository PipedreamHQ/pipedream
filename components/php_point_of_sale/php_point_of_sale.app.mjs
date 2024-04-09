import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "php_point_of_sale",
  propDefinitions: {
    registerId: {
      type: "string",
      label: "Register ID",
      description: "The ID of the register to delete or update",
      async options({ page }) {
        const resources = await this.searchRegisters({
          params: {
            offset: page * 100,
            limit: 100,
          },
        });

        return resources.map(({
          register_id, name,
        }) => ({
          value: register_id,
          label: name,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the register",
    },
    iptranDeviceId: {
      type: "string",
      label: "IP Tran Device ID",
      description: "The ID of the IP Tran Device",
      optional: true,
    },
    emvTerminalId: {
      type: "string",
      label: "EMV Terminal ID",
      description: "The ID of the EMV Terminal",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search Term",
      description: "The term to search within the registers",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.domain}/index.php/api/v1`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "x-api-key": `${this.$auth.api_key}`,
        },
        params,
      });
    },
    async createRegister(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/registers",
        ...args,
      });
    },
    async searchRegisters(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/registers",
        ...args,
      });
    },
    async deleteRegister({
      register_id, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/registers/${register_id}`,
        ...args,
      });
    },
  },
};
