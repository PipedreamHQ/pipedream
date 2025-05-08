import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wordpress_com",
  propDefinitions: {
    siteId: {
      type: "string",
      label: "Site ID or Domain",
      description: "Enter a site ID or domain (e.g. testsit38.wordpress.com). Do not include 'https://' or 'www'.",
      async options() {
        const { sites } = await this.listSites();
        return sites?.map(({
          ID: value, URL: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    postId: {
      type: "string",
      label: "Post ID",
      description: "The ID of the post",
      async options({
        site, page,
      }) {
        const { posts } = await this.getWordpressPosts({
          site,
          params: {
            page: page + 1,
            order: "DESC",
            order_by: "date",
          },
        });
        return posts?.map(({
          ID: value, title: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.wordpress.com/rest/v1.1";
    },
    _makeRequest({
      $ = this,
      path,
      contentType,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": (contentType)
            ? contentType
            : "application/json",
        },
        ...opts,
      });
    },
    createWordpressPost({
      site,
      ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sites/${site}/posts/new`,
        ...opts,
      });
    },
    uploadWordpressMedia({
      site,
      contentType,
      ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/sites/${site}/media/new`,
        contentType,
        ...opts,
      });
    },
    deleteWordpressPost({
      site,
      postId,
    }) {
      return this._makeRequest({
        method: "POST", // use POST instead of DELETE. Wordpress does not allow DELETE methods on free accounts.
        path: `/sites/${site}/posts/${postId}/delete`,
      });
    },
    getWordpressPosts({
      site,
      number,
      type,
      ...opts
    }) {
      const path = (type === "attachment")
        ? `/sites/${site}/media/`
        : `/sites/${site}/posts/`;

      return this._makeRequest({
        method: "GET",
        path,
        params: {
          order_by: "date",
          order: "DESC",
          type,
          number,
        },
        ...opts,
      });
    },
    getWordpressComments({
      site,
      postId,
      number,
      ...opts
    }) {
      const path = postId
        ? `/sites/${site}/posts/${postId}/replies/`
        : `/sites/${site}/comments/`;

      return this._makeRequest({
        method: "GET",
        path,
        params: {
          order_by: "date",
          order: "DESC",
          number,
        },
        ...opts,
      });
    },
    getWordpressFollowers({
      site,
      type,
      ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/sites/${site}/stats/followers?type=${type}`,
        ...opts,
      });
    },
    listSites(opts = {}) {
      return this._makeRequest({
        path: "/me/sites",
        ...opts,
      });
    },
    isFormData(input) {
      return (
        typeof input === "object" &&
      input !== null &&
      typeof input.getHeaders === "function" &&
      typeof input.append === "function"
      );
    },
    async initialize(subject, db, dbName) {
      if (!subject.length) {
        console.log("No ID found on first run. Source initialized with no cursor.");
        return false;
      }
      const newest = subject[0]?.ID;

      await db.set(dbName, newest);
      console.log(`Initialized ${dbName} on first run with ID ${newest}.`);
      return true ;
    },
  },
};
