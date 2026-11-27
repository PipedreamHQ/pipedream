import { axios } from "@pipedream/platform";
import {
  API_DATA_SOURCE_INPUT,
  BASE_URL,
  DATASOURCES_API_VERSION,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PRODUCTS_API_VERSION,
} from "./common/constants.mjs";
import {
  encodeProductId, toDataSourceName, toProductOption,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "google_merchant_center",
  propDefinitions: {
    productId: {
      type: "string",
      label: "Product ID",
      description: "The product identifier in the format `contentLanguage~feedLabel~offerId`, e.g. `en~US~sku123`. Use **List Product ID Options** to find valid values.",
      async options({ prevContext }) {
        if (prevContext?.pageToken === null) {
          return [];
        }
        const {
          products = [], nextPageToken,
        } = await this.listProducts({
          params: {
            pageSize: DEFAULT_PAGE_SIZE,
            pageToken: prevContext?.pageToken,
          },
        });
        return {
          options: products.map(toProductOption),
          context: {
            pageToken: nextPageToken ?? null,
          },
        };
      },
    },
    dataSourceId: {
      type: "string",
      label: "Data Source ID",
      description: "The ID or full resource name of an API product data source, e.g. `104628` or `accounts/123456/dataSources/104628`. Use **List Data Sources** to find valid values.",
    },
  },
  methods: {
    _merchantId() {
      return this.$auth.merchant_id;
    },
    _accountPath() {
      return `accounts/${this._merchantId()}`;
    },
    _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${BASE_URL}/${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    dataSourceName(dataSourceId) {
      return toDataSourceName(dataSourceId, this._merchantId());
    },
    listProducts(opts = {}) {
      return this._makeRequest({
        path: `${PRODUCTS_API_VERSION}/${this._accountPath()}/products`,
        ...opts,
      });
    },
    async *paginateProducts(opts = {}) {
      let pageToken;
      do {
        const {
          products = [], nextPageToken,
        } = await this.listProducts({
          ...opts,
          params: {
            ...opts.params,
            pageSize: MAX_PAGE_SIZE,
            pageToken,
          },
        });
        for (const product of products) {
          yield product;
        }
        pageToken = nextPageToken;
      } while (pageToken);
    },
    getProduct({
      productId, ...opts
    }) {
      return this._makeRequest({
        path: `${PRODUCTS_API_VERSION}/${this._accountPath()}/products/${encodeProductId(productId)}`,
        ...opts,
      });
    },
    listDataSources(opts = {}) {
      return this._makeRequest({
        path: `${DATASOURCES_API_VERSION}/${this._accountPath()}/dataSources`,
        ...opts,
      });
    },
    async listAllDataSources(opts = {}) {
      const dataSources = [];
      let pageToken;
      do {
        const {
          dataSources: page = [], nextPageToken,
        } = await this.listDataSources({
          ...opts,
          params: {
            ...opts.params,
            pageToken,
          },
        });
        dataSources.push(...page);
        pageToken = nextPageToken;
      } while (pageToken);
      return dataSources;
    },
    async listApiPrimaryDataSources(opts = {}) {
      const dataSources = await this.listAllDataSources(opts);
      return dataSources.filter(({
        input, primaryProductDataSource,
      }) => input === API_DATA_SOURCE_INPUT && primaryProductDataSource);
    },
    createProduct({
      dataSource, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `${PRODUCTS_API_VERSION}/${this._accountPath()}/productInputs:insert`,
        params: {
          dataSource,
        },
        ...opts,
      });
    },
    updateProduct({
      productId, dataSource, updateMask, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `${PRODUCTS_API_VERSION}/${this._accountPath()}/productInputs/${encodeProductId(productId)}`,
        params: {
          dataSource,
          updateMask,
        },
        ...opts,
      });
    },
  },
};
