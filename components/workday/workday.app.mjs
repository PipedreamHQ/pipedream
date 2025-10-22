import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "workday",
  propDefinitions: {
    workerId: {
      type: "string",
      label: "Worker ID",
      description: "The ID of a worker",
      async options({ page }) {
        const { data } = await this.listWorkers({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map((worker) => ({
          label: worker.descriptor,
          value: worker.id,
        })) || [];
      },
    },
    supervisoryOrganizationId: {
      type: "string",
      label: "Supervisory Organization ID",
      description: "The ID of a supervisory organization",
      async options({ page }) {
        const { data } = await this.listSupervisoryOrganizations({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map((organization) => ({
          label: organization.descriptor,
          value: organization.id,
        })) || [];
      },
    },
    jobChangeReasonId: {
      type: "string",
      label: "Job Change Reason ID",
      description: "The ID of a job change reason",
      async options({ page }) {
        const { data } = await this.listJobChangeReasons({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map((reason) => ({
          label: reason.descriptor,
          value: reason.id,
        })) || [];
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      default: 100,
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.rest_api_endpoint;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    getWorker({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}`,
        ...opts,
      });
    },
    listWorkers(opts = {}) {
      return this._makeRequest({
        path: "/workers",
        ...opts,
      });
    },
    listOrganizationTypes(opts = {}) {
      return this._makeRequest({
        path: "/organizationTypes",
        ...opts,
      });
    },
    listSupervisoryOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/supervisoryOrganizations",
        ...opts,
      });
    },
    listJobChangeReasons(opts = {}) {
      return this._makeRequest({
        path: "/jobChangeReasons",
        ...opts,
      });
    },
    listWorkerPayslips({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}/paySlips`,
        ...opts,
      });
    },
    createJobChange({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}/jobChanges`,
        method: "POST",
        ...opts,
      });
    },
    changeBusinessTitle({
      workerId, ...opts
    }) {
      return this._makeRequest({
        path: `/workers/${workerId}/businessTitleChanges`,
        method: "POST",
        ...opts,
      });
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          limit: DEFAULT_LIMIT,
          offset: 0,
        },
      };
      let hasMore, count = 0;
      do {
        const {
          data, total,
        } = await fn(args);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        hasMore = count < total;
        args.params.offset += args.params.limit;
      } while (hasMore);
    },
  },
};
