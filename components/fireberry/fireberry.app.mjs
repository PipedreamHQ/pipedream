import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fireberry",
  propDefinitions: {
    accountName: {
      type: "string",
      label: "Account Name",
      description: "Name of the account",
    },
    emailAddress1: {
      type: "string",
      label: "Email Address",
      description: "Email address",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name",
      optional: true,
    },
    websiteUrl: {
      type: "string",
      label: "Website URL",
      description: "URL of the website",
      optional: true,
    },
    articleName: {
      type: "string",
      label: "Article Name",
      description: "Name of the article",
    },
    articleSubject: {
      type: "string", //O type na verdade é 'int32' segundo as refs, mas a descrição é 'Short text subject of the article.', então imagino que seja um erro deles
      label: "Article Subject",
      description: "Subject of the article",
    },
    articleBody: {
      type: "string",
      label: "Article Body",
      description: "Body of the article",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Article description",
      optional: true,
    },
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
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "tokenid": `${this.$auth.api_access_token}`,
        },
      });
    },
    async createArticle(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/record/article",
        ...args,
      });
    },
    async getAllArticles(args = {}) {
      return this._makeRequest({
        path: "/record/article",
        ...args,
      });
    },
    async createAccount(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/record/account",
        ...args,
      });
    },
    async getAllAccounts(args = {}) {
      return this._makeRequest({
        path: "/record/account",
        ...args,
      });
    },
  },
};
