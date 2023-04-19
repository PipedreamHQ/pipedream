import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "drata",
  propDefinitions: {
    workspaceId: {
      type: "integer",
      label: "Workspace ID",
      description: "The ID of the workspace.",
      async options({ page }) {
        const response = await this.listWorkspaces({
          params: {
            page: ++page,
          },
        });
        return response.data.map((workspace) => ({
          label: workspace.name,
          value: workspace.id,
        }));
      },
    },
    personnelId: {
      type: "integer",
      label: "Personnel ID",
      description: "The ID of the personnel.",
      async options({
        page, ...opts
      }) {
        const response = await this.listPersonnel({
          params: {
            ...opts,
            page: ++page,
          },
        });
        return response.data.map((personnel) => ({
          label: this.getPersonnelName(personnel),
          value: personnel.id,
        }));
      },
    },
    vendorId: {
      type: "integer",
      label: "Vendor ID",
      description: "The ID of the vendor.",
      async options({ page }) {
        const response = await this.listVendors({
          params: {
            page: ++page,
          },
        });
        return response.data.map((vendor) => ({
          label: vendor.name,
          value: vendor.id,
        }));
      },
    },
    controlId: {
      type: "integer",
      label: "Control ID",
      description: "The ID of the control.",
      async options({ page }) {
        const response = await this.listControls({
          params: {
            page: ++page,
          },
        });
        return response.data.map((control) => ({
          label: control.name,
          value: control.id,
        }));
      },
    },
  },
  methods: {
    ...utils.methods,
    async _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        ...opts,
        url: `https://public-api.drata.com/public${path}`,
        headers: {
          ...opts.headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async paginate({
      fn, ...opts
    }) {
      const { total } = await fn.call(this, {
        ...opts,
        params: {
          ...opts.params,
          limit: 1,
        },
      });

      const promises = [];
      const numberOfPages = Math.ceil(total / constants.PAGINATION_LIMIT);
      for (let page = 1; page <= numberOfPages; page++) {
        promises.push(fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            limit: constants.PAGINATION_LIMIT,
            page,
          },
        }));
      }

      const responses = await Promise.all(promises);
      const results = responses.reduce((results, { data }) => ([
        ...results,
        ...data,
      ]), []);

      return {
        data: results,
        page: numberOfPages,
        total,
      };
    },
    async listWorkspaces({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listWorkspaces,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/workspaces",
      });
    },
    async listPersonnel({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listPersonnel,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/personnel",
      });
    },
    async getPersonnelById({
      id, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/personnel/${id}`,
      });
    },
    async listAssets({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listAssets,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/assets",
      });
    },
    async createAsset(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/assets",
        method: "POST",
      });
    },
    async listControls({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listControls,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/controls",
      });
    },
    async createControl({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/workspaces/${workspaceId}/controls`,
        method: "POST",
      });
    },
    async listMonitors({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listMonitors,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/monitors",
      });
    },
    async listEvidencesForControl({
      controlId, paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          controlId,
          fn: this.listEvidencesForControl,
        });
      }
      return this._makeRequest({
        ...opts,
        path: `/controls/${controlId}/external-evidence`,
      });
    },
    async listVendors({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listVendors,
        });
      }
      return this._makeRequest({
        path: "/vendors",
      });
    },
    async createVendor(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/vendors",
        method: "POST",
      });
    },
    async updateVendor({
      vendorId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/vendors/${vendorId}`,
        method: "PUT",
      });
    },
    async uploadBackgroundCheck({
      personnelId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/background-check/${personnelId}/manual`,
        method: "POST",
      });
    },
    async uploadUserComplianceDocument({
      userId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/users/${userId}/documents`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    async uploadDeviceComplianceDocument({
      deviceId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/devices/${deviceId}/documents`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
  },
};
