import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "sellsy",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "Identifier of the related company",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { data } = await this.listCompanies({
          params: {
            limit,
            offset: page * limit,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    opportunityIds: {
      type: "integer[]",
      label: "Opportunity ID",
      description: "Filter results by opportunity",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { data } = await this.listOpportunities({
          params: {
            limit,
            offset: page * limit,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    pipelineId: {
      type: "string",
      label: "Pipeline ID",
      description: "Identifier of the pipeline for the opportunity",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { data } = await this.listPipelines({
          params: {
            limit,
            offset: page * limit,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    stepId: {
      type: "string",
      label: "Step ID",
      description: "Identifier of the pipeline step for the opportunity",
      async options({
        pipelineId, page,
      }) {
        const limit = constants.DEFAULT_LIMIT;
        const { data } = await this.listPipelineSteps({
          pipelineId,
          params: {
            limit,
            offset: page * limit,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sellsy.com/v2";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
        ...opts,
      });
    },
    getContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    getCompany({
      companyId, ...opts
    }) {
      return this._makeRequest({
        path: `/companies/${companyId}`,
        ...opts,
      });
    },
    getOpportunity({
      opportunityId, ...opts
    }) {
      return this._makeRequest({
        path: `/opportunities/${opportunityId}`,
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    listOpportunities(opts = {}) {
      return this._makeRequest({
        path: "/opportunities",
        ...opts,
      });
    },
    listPipelines(opts = {}) {
      return this._makeRequest({
        path: "/opportunities/pipelines",
        ...opts,
      });
    },
    listPipelineSteps({
      pipelineId, ...opts
    }) {
      return this._makeRequest({
        path: `/opportunities/pipelines/${pipelineId}/steps`,
        ...opts,
      });
    },
    searchCompanies(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/search",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    createOpportunity(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/opportunities",
        ...opts,
      });
    },
    createCompany(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies",
        ...opts,
      });
    },
  },
};
