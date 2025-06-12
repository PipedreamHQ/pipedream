import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "prodatakey",
  propDefinitions: {
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization.",
      async options() {
        const organizations = await this.listOrganizations();
        return organizations.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    holderId: {
      type: "string",
      label: "Holder ID",
      description: "The ID of the holder.",
      async options({ organizationId }) {
        const holders = await this.listHolders({
          organizationId,
        });

        return holders.map(({
          id: value, firstName, lastName, email,
        }) => ({
          label: `${firstName} ${lastName} (${email})`,
          value,
        }));
      },
    },
    credentialId: {
      type: "string",
      label: "Credential ID",
      description: "The ID of the credential to retrieve.",
      async options({
        organizationId, holderId,
      }) {
        const credentials = await this.listCredentials({
          organizationId,
          holderId,
        });

        return credentials.map(({
          id: value, description: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    cloudNodeId: {
      type: "string",
      label: "Cloud Node ID",
      description: "The ID of the cloud node.",
      async options({ organizationId }) {
        const cloudNodes = await this.listCloudNodes({
          organizationId,
        });

        return cloudNodes.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    deviceId: {
      type: "string",
      label: "Device ID",
      description: "The ID of the device to retrieve.",
      async options({
        organizationId, cloudNodeId,
      }) {
        const devices = await this.listDevices({
          organizationId,
          cloudNodeId,
        });

        return devices.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    dealerId: {
      type: "string",
      label: "Dealer ID",
      description: "The ID of the dealer to retrieve.",
      async options() {
        const dealers = await this.listDealers();
        return dealers.map((dealer) => ({
          label: dealer.name,
          value: dealer.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl(systemId = null) {
      return `https://${systemId
        ? "systems"
        : "accounts"}.pdk.io`;
    },
    async _headers({ systemId = null }) {
      if (systemId) {
        const { token } = await this.getSystemToken({
          systemId,
        });
        return {
          Authorization: `Bearer ${token}`,
        };
      }

      return {
        Authorization: `Bearer ${this.$auth.id_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, systemId, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(systemId) + path,
        headers: await this._headers({
          systemId,
        }),
        ...opts,
      });
    },
    getSystemToken({
      systemId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/systems/${systemId}/token`,
        ...opts,
      });
    },
    listOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/api/organizations/mine",
        ...opts,
      });
    },
    retrieveOrganization({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        path: `/api/organizations/${organizationId}`,
        ...opts,
      });
    },
    async listHolders({
      organizationId, ...opts
    }) {
      const { systemId } = await this.retrieveOrganization({
        organizationId,
      });
      return this._makeRequest({
        path: `/${systemId}/holders`,
        ...opts,
      });
    },
    async listCredentials({
      organizationId, holderId, ...opts
    }) {
      const { systemId } = await this.retrieveOrganization({
        organizationId,
      });
      return this._makeRequest({
        path: `/${systemId}/holders/${holderId}/credentials`,
        systemId,
        ...opts,
      });
    },
    async retrieveCredential({
      organizationId, holderId, credentialId,
    }) {
      const { systemId } = await this.retrieveOrganization({
        organizationId,
      });
      return this._makeRequest({
        path: `/${systemId}/holders/${holderId}/credentials/${credentialId}`,
        systemId,
      });
    },
    listDealers(opts = {}) {
      return this._makeRequest({
        path: "/api/dealers",
        ...opts,
      });
    },
    async listCloudNodes({
      organizationId, ...opts
    }) {
      const { systemId } = await this.retrieveOrganization({
        organizationId,
      });
      return this._makeRequest({
        path: `/${systemId}/cloud-nodes`,
        systemId,
        ...opts,
      });
    },
    async listDevices({
      organizationId, cloudNodeId, ...opts
    }) {
      const { systemId } = await this.retrieveOrganization({
        organizationId,
      });
      return this._makeRequest({
        path: `/${systemId}/cloud-nodes/${cloudNodeId}/devices`,
        systemId,
        ...opts,
      });
    },
    async openAndCloseDevice({
      organizationId, cloudNodeId, deviceId, data,
    }) {
      const { systemId } = await this.retrieveOrganization({
        organizationId,
      });
      return this._makeRequest({
        method: "POST",
        path: `/${systemId}/cloud-nodes/${cloudNodeId}/devices/${deviceId}/try-open`,
        systemId,
        data,
      });
    },
    createHook({
      organizationId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/api/organizations/${organizationId}/subscriptions`,
        ...opts,
      });
    },
    deleteHook({
      organizationId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/api/organizations/${organizationId}/subscriptions/${webhookId}`,
      });
    },
  },
};
