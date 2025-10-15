import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "databricks",
  propDefinitions: {
    jobId: {
      type: "string",
      label: "Job",
      description: "Identifier of a job",
      async options({ prevContext }) {
        if (prevContext.pageToken === null) {
          return [];
        }
        const {
          jobs, next_page_token: pageToken,
        } = await this.listJobs({
          params: {
            page_token: prevContext.pageToken,
            limit: constants.DEFAULT_LIMIT,
          },
        });
        const options = jobs?.map(({
          job_id: value, settings,
        }) => ({
          value,
          label: settings?.name || value,
        })) || [];
        return {
          options,
          context: {
            pageToken: pageToken || null,
          },
        };
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
          endpoints = [], next_page_token,
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
    indexName: {
      type: "string",
      label: "Index Name",
      description: "The name of the vector search index",
      async options({ endpointName }) {
        if (!endpointName) {
          return [];
        }
        const { vector_indexes = [] } = await this.listVectorSearchIndexes({
          params: {
            endpoint_name: endpointName,
          },
        });

        return vector_indexes.map(({ name }) => ({
          value: name,
          label: name,
        }));
      },
    },
  },
  methods: {
    getUrl(path, versionPath = constants.VERSION_PATH.V2_0) {
      const baseUrl = constants.BASE_URL.replace(constants.DOMAIN_PLACEHOLDER, this.$auth.domain);
      return `${baseUrl}${versionPath}${path}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, versionPath, ...args
    } = {}) {
      return axios($, {
        url: this.getUrl(path, versionPath),
        headers: this._headers(),
        ...args,
      });
    },
    createJob(args = {}) {
      return this._makeRequest({
        path: "/jobs/create",
        method: "POST",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    listJobs(args = {}) {
      return this._makeRequest({
        path: "/jobs/list",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    getJob(args = {}) {
      return this._makeRequest({
        path: "/jobs/get",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    resetJob(args = {}) {
      return this._makeRequest({
        path: "/jobs/reset",
        method: "POST",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    updateJob(args = {}) {
      return this._makeRequest({
        path: "/jobs/update",
        method: "POST",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    deleteJob(args = {}) {
      return this._makeRequest({
        path: "/jobs/delete",
        method: "POST",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    runJobNow(args = {}) {
      return this._makeRequest({
        path: "/jobs/run-now",
        method: "POST",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    getRun(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/get",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    listRuns(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/list",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    cancelRun(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/cancel",
        method: "POST",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    cancelAllRuns(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/cancel-all",
        method: "POST",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    getRunOutput(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/get-output",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    deleteRun(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/delete",
        method: "POST",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    repairRun(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/repair",
        method: "POST",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    exportRun(args = {}) {
      return this._makeRequest({
        path: "/jobs/runs/export",
        versionPath: constants.VERSION_PATH.V2_2,
        ...args,
      });
    },
    getJobPermissions({
      jobId, ...args
    }) {
      return this._makeRequest({
        path: `/permissions/jobs/${jobId}`,
        ...args,
      });
    },
    setJobPermissions({
      jobId, ...args
    }) {
      return this._makeRequest({
        path: `/permissions/jobs/${jobId}`,
        method: "PUT",
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
    createVectorSearchIndex(args = {}) {
      return this._makeRequest({
        path: "/vector-search/indexes",
        method: "POST",
        ...args,
      });
    },

    getVectorSearchIndex({
      indexName, ...args
    }) {
      return this._makeRequest({
        path: `/vector-search/indexes/${indexName}`,
        method: "GET",
        ...args,
      });
    },

    listVectorSearchIndexes({
      params, ...args
    }) {
      return this._makeRequest({
        path: "/vector-search/indexes",
        method: "GET",
        params,
        ...args,
      });
    },

    deleteVectorSearchIndex({
      indexName, ...args
    }) {
      return this._makeRequest({
        path: `/vector-search/indexes/${indexName}`,
        method: "DELETE",
        ...args,
      });
    },

    queryVectorSearchIndex({
      indexName, ...args
    }) {
      return this._makeRequest({
        path: `/vector-search/indexes/${indexName}/query`,
        method: "POST",
        ...args,
      });
    },

    syncVectorSearchIndex({
      indexName, ...args
    }) {
      return this._makeRequest({
        path: `/vector-search/indexes/${indexName}/sync`,
        method: "POST",
        ...args,
      });
    },

    deleteVectorSearchData({
      indexName, params, ...args
    })
    {
      return this._makeRequest({
        path: `/vector-search/indexes/${indexName}/delete-data`,
        method: "DELETE",
        params,
        paramsSerializer: {
          indexes: null,
        },
        ...args,
      });
    },

    upsertVectorSearchIndexData({
      indexName, ...args
    }) {
      return this._makeRequest({
        path: `/vector-search/indexes/${indexName}/upsert-data`,
        method: "POST",
        ...args,
      });
    },

    scanVectorSearchIndex({
      indexName, ...args
    }) {
      return this._makeRequest({
        path: `/vector-search/indexes/${indexName}/scan`,
        method: "POST",
        ...args,
      });
    },
    async paginate({
      requestor, requestorArgs = {},
      maxRequests = 3, resultsKey = "jobs",
    }) {
      const allResults = [];
      let requestCount = 0;
      let nextPageToken = null;
      let hasMore = true;

      while (hasMore && requestCount < maxRequests) {
        try {
          const response = await requestor({
            ...requestorArgs,
            params: {
              ...requestorArgs.params,
              page_token: nextPageToken,
            },
          });

          requestCount++;

          const results = response[resultsKey] || [];

          allResults.push(...results);

          nextPageToken = response.next_page_token;
          hasMore = !!nextPageToken;

          if (results.length === 0) {
            hasMore = false;
          }

        } catch (error) {
          console.error(`Pagination error on request ${requestCount}:`, error);
          throw error;
        }
      }

      return allResults;
    },
  },
};
