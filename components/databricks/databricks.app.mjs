import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "databricks",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job",
      description: "Identifier of a job",
      async options() {
        const { jobs } = await this.listJobs();
        return jobs?.map(({
          job_id: value, settings,
        }) => ({
          value,
          label: settings.name,
        })) || [];
      },
    },
    runId: {
      type: "string",
      label: "Run",
      description: "Identifier of a run",
      async options({
        jobId, page,
      }) {
        const limit = 20;
        const params = {
          limit,
          offset: page * limit,
        };
        if (jobId) {
          params.job_id = jobId;
        }
        const { runs } = await this.listRuns({
          params,
        });
        return runs?.map(({
          run_id: value, run_name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    endpointName: {
      type: "string",
      label: "Endpoint Name",
      description: "The name of the vector search endpoint",
      async options({ prevContext }) {
        const {
          endpoints, next_page_token,
        } = await this.listEndpoints({
          params: {
            page_token: prevContext.page_token,
          },
        });

        return {
          options: endpoints.map(({ name }) => name),
          context: {
            page_token: next_page_token,
          },
        };
      },
    },
    warehouseId: {
      type: "string",
      label: "Warehouse ID",
      description: "The ID of the SQL Warehouse to get runs from",
      async options() {
        const { warehouses } = await this.listSQLWarehouses();
        return warehouses?.map(({
          id: value,
          name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {

    _baseUrl() {
      return `https://${this.$auth.domain}.cloud.databricks.com/api/2.0`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.access_token}`,
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
    listJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs/list",
        ...args,
      });
    },
    listRuns(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/list",
        ...args,
      });
    },
    getRunOutput(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/get-output",
        ...args,
      });
    },
    runJobNow(args = {}) {
      return this._makeRequest({
        path: "/jobs/run-now",
        method: "POST",
        ...args,
      });
    },
    createEndpoint(args = {}) {
      return this._makeRequest({
        path: "/vector-search/endpoints",
        method: "POST",
        ...args,
      });
    },
    createSQLWarehouse(args = {}) {
      return this._makeRequest({
        path: "/sql/warehouses",
        method: "POST",
        ...args,
      });
    },
    getEndpoint({
      endpointName, ...opts
    }) {
      return this._makeRequest({
        path: `/vector-search/endpoints/${endpointName}`,
        ...opts,
      });
    },
    listEndpoints(args = {}) {
      return this._makeRequest({
        path: "/vector-search/endpoints",
        ...args,
      });
    },
    deleteEndpoint({
      endpointName, ...opts
    }) {
      return this._makeRequest({
        path: `/vector-search/endpoints/${endpointName}`,
        method: "DELETE",
        ...opts,
      });
    },
    deleteSQLWarehouse({
      warehouseId, ...args
    }) {
      return this._makeRequest({
        path: `/sql/warehouses/${warehouseId}`,
        method: "DELETE",
        ...args,
      });
    },
    getSQLWarehouse({
      warehouseId, ...args
    }) {
      return this._makeRequest({
        path: `/sql/warehouses/${warehouseId}`,
        method: "GET",
        ...args,
      });
    },
    listSQLWarehouses(args = {}) {
      return this._makeRequest({
        path: "/sql/warehouses",
        ...args,
      });
    },
    editSQLWarehouse({
      warehouseId, ...args
    }) {
      return this._makeRequest({
        path: `/sql/warehouses/${warehouseId}/edit`,
        method: "POST",
        ...args,
      });
    },
    startSQLWarehouse({
      warehouseId, ...args
    }) {
      return this._makeRequest({
        path: `/sql/warehouses/${warehouseId}/start`,
        method: "POST",
        ...args,
      });
    },

    stopSQLWarehouse({
      warehouseId, ...args
    }) {
      return this._makeRequest({
        path: `/sql/warehouses/${warehouseId}/stop`,
        method: "POST",
        ...args,
      });
    },

    getSQLWarehouseConfig(args = {}) {
      return this._makeRequest({
        path: "/sql/config/warehouses",
        method: "GET",
        ...args,
      });
    },

    setSQLWarehouseConfig(args = {}) {
      return this._makeRequest({
        path: "/sql/config/warehouses",
        method: "PUT",
        ...args,
      });
    },
    getSQLWarehousePermissions({
      warehouseId, ...args
    }) {
      return this._makeRequest({
        path: `/permissions/warehouses/${warehouseId}`,
        method: "GET",
        ...args,
      });
    },

    setSQLWarehousePermissions({
      warehouseId, ...args
    }) {
      return this._makeRequest({
        path: `/permissions/warehouses/${warehouseId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
