import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "kaleido",
  propDefinitions: {
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contract project (must be unique across all contracts in the consortium)",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the contract",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of contract project being created",
      options: constants.TYPES,
    },
    manageEnvs: {
      type: "boolean",
      label: "Manage Enviroments",
      description: "Determines whether the member can create and upgrade environments",
    },
    inviteOrgs: {
      type: "boolean",
      label: "Invite Organizaions",
      description: "Determines whether the member can invite other orgs to the consortium",
    },
    createSigners: {
      type: "boolean",
      label: "Create Signers",
      description: "Determines whether the member can create signing nodes in environments",
    },
    multipleMembers: {
      type: "boolean",
      label: "Multiple Members",
      description: "Determines whether the member can create additional membership for themselves",
    },
    consortiaId: {
      type: "string",
      label: "Consortia ID",
      description: "ID of the Consortia",
      async options() {
        const consoriaIds = await this.getConsortia();

        return consoriaIds.map(({
          _id, name,
        }) => ({
          value: _id,
          label: name,
        }));
      },
    },
    contractId: {
      type: "string",
      label: "Contract ID",
      description: "ID of the Contract",
      async options({ consortiaId }) {
        const contractsIds = await this.getContracts({
          consortiaId,
        });

        return contractsIds.map(({
          _id, name,
        }) => ({
          value: _id,
          label: name,
        }));
      },
    },
    membershipId: {
      type: "string",
      label: "Membership ID",
      description: "Field denoting the membership which owns the Contract",
      async options({ consortiaId }) {
        const membershipIds = await this.getMemberships({
          consortiaId,
        });

        return membershipIds.map(({ _id }) => ({
          value: _id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.endpoint}.kaleido.io/api/v1`;
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
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_keys}`,
        },
      });
    },
    async createContract({
      consortiaId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/consortia/${consortiaId}/contracts`,
        ...args,
      });
    },
    async createMembership({
      consortiaId, ...args
    }) {
      return this._makeRequest({
        method: "post",
        path: `/consortia/${consortiaId}/memberships`,
        ...args,
      });
    },
    async deleteContract({
      consortiaId, contractId, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        path: `/consortia/${consortiaId}/contracts/${contractId}`,
        ...args,
      });
    },
    async getConsortia(args = {}) {
      return this._makeRequest({
        path: "/consortia",
        ...args,
      });
    },
    async getContracts({
      consortiaId: consortiaId, ...args
    }) {
      return this._makeRequest({
        path: `/consortia/${consortiaId}/contracts`,
        ...args,
      });
    },
    async getMemberships({
      consortiaId: consortiaId, ...args
    }) {
      return this._makeRequest({
        path: `/consortia/${consortiaId}/memberships`,
        ...args,
      });
    },
  },
};
