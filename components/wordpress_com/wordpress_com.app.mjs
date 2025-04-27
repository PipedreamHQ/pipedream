import methods from "./common/methods.mjs";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wordpress_com",
  propDefinitions: {},
  methods: {

    ...methods,
    // this.$auth contains connected account data
    _makeRequest({
      $ = this,
      url,
      contentType,
      ...opts
    }) {
  
      return axios($, {
          url,
          headers : {
            "Authorization":  `Bearer ${this.$auth.oauth_access_token}`,
            "Content-Type": (contentType) ? contentType : "application/json",
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
        url: `https://public-api.wordpress.com/rest/v1.1/sites/${site}/posts/new`, 
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
        url: `https://public-api.wordpress.com/rest/v1.1/sites/${site}/media/new`,
        contentType,
        ...opts
      });
    },

    deleteWordpressPost({
      site,
      postId,
    }) {
      
      return this._makeRequest({
        method: "POST", // use POST instead of DELETE. Wordpress does not allow DELETE methods on free accounts. 
        url: `https://public-api.wordpress.com/rest/v1.1/sites/${site}/posts/${postId}/delete`,
      });
    },

    getWordpressPosts({
      site,
      number,
      type,
      ...opts
    }){
      const url = (type === "attachment")
      ? `https://public-api.wordpress.com/rest/v1.1/sites/${site}/media/`
      : `https://public-api.wordpress.com/rest/v1.1/sites/${site}/posts/`;

      return this._makeRequest({
        method: "GET", // use POST instead of DELETE. Wordpress does not allow DELETE methods on free accounts. 
        url, 
        params : {
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
      const url = postId
        ? `https://public-api.wordpress.com/rest/v1.1/sites/${site}/posts/${postId}/replies/`
        : `https://public-api.wordpress.com/rest/v1.1/sites/${site}/comments/`;
    
      return this._makeRequest({
        method: "GET",
        url,
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
      ...opts
    }) {
      return this._makeRequest({
        method: "GET",
        url: `https://public-api.wordpress.com/rest/v1.1/sites/${site}/followers/`,

        ...opts,
      });
    },

  },
};
