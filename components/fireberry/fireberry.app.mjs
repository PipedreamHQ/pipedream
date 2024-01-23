import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fireberry",
  propDefinitions: {
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The maximum number of records displayed per page, cannot exceed 50.",
      min: 1,
      max: 50,
      default: 20,
    },
    pageNumber: {
      type: "integer",
      label: "Page Number",
      description: "The number of the page displayed, cannot exceed 10.",
      min: 1,
      max: 10,
      default: 1,
    },
    articleName: {
      type: "string",
      label: "Article Name",
      description: "Article name (Primary)",
      required: true,
    },
    articleSubject: {
      type: "string",
      label: "Article Subject",
      description: "Short text subject of the article.",
      required: true,
    },
    articleBody: {
      type: "string",
      label: "Article Body",
      description: "Long text body of the article.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of up to 4,000 characters.",
      optional: true,
    },
    ownerId: {
      type: "string",
      label: "Owner ID",
      description: "The GUID of the system user who created the record, can also be set manually. Will be used for permissions.",
      optional: true,
    },
    stateCode: {
      type: "integer",
      label: "State Code",
      description: "The state of the article. (Picklist)",
      optional: true,
    },
    statusCode: {
      type: "integer",
      label: "Status Code",
      description: "The status of the article. (Picklist)",
      optional: true,
    },
    viewCount: {
      type: "integer",
      label: "View Count",
      description: "Number of times the article was viewed.",
      optional: true,
    },
    accountName: {
      type: "string",
      label: "Account Name",
      description: "Name of the account",
      required: true,
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "Used for identification, unique values are recommended",
      optional: true,
    },
    // ... Add other required and optional props for creating an account
  },
  methods: {
    _baseUrl() {
      return "https://api.fireberry.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async createArticle({
      articleName, articleSubject, articleBody, description, ownerId, stateCode, statusCode, viewCount,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/record/article",
        data: {
          articlename: articleName,
          articlesubject: articleSubject,
          articlebody: articleBody,
          description,
          ownerid: ownerId,
          statecode: stateCode,
          statuscode: statusCode,
          viewcount: viewCount,
        },
      });
    },
    async getAllArticles({
      pageSize, pageNumber,
    }) {
      return this._makeRequest({
        path: `/record/article?pagesize=${pageSize}&pagenumber=${pageNumber}`,
      });
    },
    async createAccount({
      accountName, accountNumber, ...otherProps
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/record/account",
        data: {
          accountname: accountName,
          accountnumber: accountNumber,
          ...otherProps,
        },
      });
    },
    async getAllAccounts({
      pageSize, pageNumber,
    }) {
      return this._makeRequest({
        path: `/record/account?pagesize=${pageSize}&pagenumber=${pageNumber}`,
      });
    },
    // Pagination method for accounts
    async paginateAccounts(fn, params) {
      const results = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fn({
          ...params,
          page,
        });
        results.push(...response);
        hasMore = response.length === params.pagesize;
        page += 1;
      }

      return results;
    },
    // Pagination method for articles
    async paginateArticles(fn, params) {
      const results = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fn({
          ...params,
          page,
        });
        results.push(...response);
        hasMore = response.length === params.pagesize;
        page += 1;
      }

      return results;
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
