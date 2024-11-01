import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gocanvas",
  propDefinitions: {
    applicationId: {
      type: "string",
      label: "Application ID",
      description: "The ID of the GoCanvas application",
    },
    submissionId: {
      type: "string",
      label: "Submission ID",
      description: "The ID of the submission to get dynamic fields",
      optional: true,
    },
    dispatchApp: {
      type: "string",
      label: "Dispatch App",
      description: "The name of a dispatch-enabled GoCanvas app",
    },
    dispatchDescription: {
      type: "string",
      label: "Dispatch Description",
      description: "The 'description' of the dispatch to be deleted",
    },
    referenceDataFile: {
      type: "string",
      label: "Reference Data File",
      description: "The name of the GoCanvas reference data file to be synced",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.gocanvas.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async emitNewEvent(opts = {}) {
      return this._makeRequest({
        path: `/submissions/${opts.submissionId}`,
        ...opts,
      });
    },
    async createDispatchItem(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/dispatches",
        data: {
          app_name: opts.dispatchApp,
        },
        ...opts,
      });
    },
    async removeDispatch(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/dispatches",
        params: {
          description: opts.dispatchDescription,
        },
        ...opts,
      });
    },
    async syncReferenceDataFile(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/reference_data_files/${opts.referenceDataFile}`,
        ...opts,
      });
    },
  },
};
