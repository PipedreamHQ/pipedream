import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "the_official_board",
  propDefinitions: {
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The ID of the company",
    },
    executiveId: {
      type: "string",
      label: "Bio ID",
      description: "The ID of the executive to get information for",
    },
  },
  methods: {
    _baseApiUrl() {
      return "https://rest.theofficialboard.com/rest";
    },
    _headers(headers = {}) {
      return {
        "token": this.$auth.api_token,
        "Accept": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    } = {}) {
      return axios($, {
        url: `${this._baseApiUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getExecutiveSearch(opts = {}) {
      return this._makeRequest({
        path: "/executive/search",
        ...opts,
      });
    },
    getCompanySearch(opts = {}) {
      return this._makeRequest({
        path: "/company/search",
        ...opts,
      });
    },
    getCompanyOrgchart(opts = {}) {
      return this._makeRequest({
        path: "/company/orgchart",
        ...opts,
      });
    },
    exportOrgchartExcel(opts = {}) {
      return this._makeRequest({
        path: "/export/orgchart-excel",
        responseType: "arraybuffer",
        ...opts,
      });
    },
    exportOrgchartPdf(opts = {}) {
      return this._makeRequest({
        path: "/export/orgchart-pdf",
        responseType: "arraybuffer",
        ...opts,
      });
    },
    getExecutiveBiography(opts = {}) {
      return this._makeRequest({
        path: "/executive/biography",
        ...opts,
      });
    },
  },
};
