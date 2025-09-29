import { axios } from "@pipedream/platform";
import mutations from "./common/mutations.mjs";

export default {
  type: "app",
  app: "afosto",
  propDefinitions: {
    cartId: {
      type: "string",
      label: "Cart ID",
      description: "The ID of the cart",
    },
  },
  methods: {
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.auth_token}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _baseUrl() {
      return "https://afosto.app/graphql";
    },
    _makeRequest({
      $ = this, path = "", headers, ...opts
    }) {
      return axios($, {
        method: "POST",
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    query(opts = {}) {
      return this._makeRequest({
        method: "POST",
        ...opts,
      });
    },
    addInformationToCart({
      variables, ...opts
    }) {
      return this._makeRequest({
        data: JSON.stringify({
          query: mutations.addInformationToCart,
          variables,
        }),
        ...opts,
      });
    },
    addItemToCart({
      variables, ...opts
    }) {
      return this._makeRequest({
        data: JSON.stringify({
          query: mutations.addItemToCart,
          variables,
        }),
        ...opts,
      });
    },
    addNoteToCart({
      variables, ...opts
    }) {
      return this._makeRequest({
        data: JSON.stringify({
          query: mutations.addNoteToCart,
          variables,
        }),
        ...opts,
      });
    },
    confirmCart({
      variables, ...opts
    }) {
      return this._makeRequest({
        data: JSON.stringify({
          query: mutations.confirmCart,
          variables,
        }),
        ...opts,
      });
    },
    createCart(opts = {}) {
      return this._makeRequest({
        data: JSON.stringify({
          query: mutations.createCart,
        }),
        ...opts,
      });
    },
  },
};
