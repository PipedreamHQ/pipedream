import { axios } from "@pipedream/platform";
import { parseStringPromise } from "xml2js";

export default {
  type: "app",
  app: "workflow_max",
  propDefinitions: {
    clientUuid: {
      type: "string",
      label: "Client UUID",
      description: "UUID of the client",
      async options() {
        const responseXml = await this.getClients();
        const result = await parseStringPromise(responseXml, {
          explicitArray: false,
        });
        const clients = result.Response.Clients.Client;
        const clientsArray = Array.isArray(clients)
          ? clients
          : [
            clients,
          ];
        return clientsArray
          .filter((client) => client && client.Name && client.UUID)
          .map((client) => ({
            label: client.Name,
            value: client.UUID,
          }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the client group",
    },
    taxable: {
      type: "boolean",
      label: "Taxable",
      description: "Wheter the client group is taxable",
    },
    clientGroupUuid: {
      type: "string",
      label: "Client Group",
      description: "UUID of the client group",
      async options() {
        const responseXml = await this.getClientGroups();
        const result = await parseStringPromise(responseXml, {
          explicitArray: false,
        });
        const groups = result.Response.Groups.Group;
        const groupsArray = Array.isArray(groups)
          ? groups
          : [
            groups,
          ];
        return groupsArray.filter((group) => group && group.Name && group.UUID).map((group) => ({
          label: group.Name,
          value: group.UUID,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.workflowmax2.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/xml",
          "account_id": `${this.$auth.account_id}`,
          ...headers,
        },
      });
    },
    async createClientGroup(args = {}) {
      return this._makeRequest({
        path: "/clientgroup.api/add",
        method: "post",
        ...args,
      });
    },
    async getClients(args = {}) {
      return this._makeRequest({
        path: "/client.api/list",
        ...args,
      });
    },
    async getClientGroups(args = {}) {
      return this._makeRequest({
        path: "/clientgroup.api/list",
        ...args,
      });
    },
    async deleteClientGroup(args = {}) {
      return this._makeRequest({
        path: "/clientgroup.api/delete",
        method: "post",
        ...args,
      });
    },
  },
};
