import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "getty_images",
  propDefinitions: {
    phrase: {
      type: "string",
      label: "Search Phrase",
      description: "Keywords or a phrase to search for, e.g. `golden gate bridge` or `business team meeting`.",
    },
    imageType: {
      type: "string",
      label: "Image Type",
      description: "Scope the search to creative, editorial, or all images. Creative images are royalty-free or rights-managed stock; editorial covers news, sports, and entertainment.",
      options: constants.imageTypeOptions,
      optional: true,
    },
    orientation: {
      type: "string",
      label: "Orientation",
      description: "Filter results by image orientation.",
      options: constants.orientationOptions,
      optional: true,
    },
    licenseModel: {
      type: "string",
      label: "License Model",
      description: "Filter creative images by license type. Only applies when **Image Type** is `creative`.",
      options: constants.licenseModelOptions,
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Order in which to return search results.",
      options: constants.sortOrderOptions,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results to return per page (1–100). Defaults to 30.",
      optional: true,
    },
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The Getty Images asset ID of the image, e.g. `83454804`. Available in search results as the `id` field.",
    },
    collectionName: {
      type: "string",
      label: "Collection Name",
      description: "Name for the new image collection.",
    },
    collectionDescription: {
      type: "string",
      label: "Collection Description",
      description: "Optional description for the new image collection.",
      optional: true,
    },
    boardId: {
      type: "string",
      label: "Board",
      description: "The board (collection) to watch for new assets.",
      async options({ page }) {
        const { boards = [] } = await this.getBoards({
          page: page + 1,
        });
        return boards.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        }));
      },
    },
    productType: {
      type: "string",
      label: "Product Type",
      description: "The product subscription to charge the download against. Options are loaded from your active Getty Images products.",
      async options() {
        const { products = [] } = await this.getProducts();
        return products
          .filter(({ status }) => status === "active")
          .map(({
            id, name, type,
          }) => ({
            label: `${name} (${type})`,
            value: String(id),
          }));
      },
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $ = this, method = "GET", path, params, data,
    }) {
      return axios($, {
        method,
        url: `https://api.gettyimages.com/v3${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Api-Key": this.$auth.oauth_client_id,
        },
        params,
        data,
      });
    },
    getProducts({ $ } = {}) {
      return this._makeRequest({
        $,
        path: "/products",
      });
    },
    getBoards({
      $, page = 1,
    } = {}) {
      return this._makeRequest({
        $,
        path: "/boards",
        params: {
          page,
          pageSize: 100,
        },
      });
    },
    getBoardAssets({
      $, boardId,
    }) {
      return this._makeRequest({
        $,
        path: `/boards/${boardId}`,
      });
    },
    getDownloads({
      $, dateFrom, dateTo, page = 1,
    }) {
      return this._makeRequest({
        $,
        path: "/downloads",
        params: {
          date_from: dateFrom,
          date_to: dateTo,
          use_time: true,
          page,
          page_size: 100,
        },
      });
    },
    searchImages({
      $,
      imageType,
      phrase,
      orientation,
      licenseModel,
      sortOrder,
      pageSize,
      fields = [
        "summary_set",
      ],
    }) {
      const pathMap = {
        creative: "/search/images/creative",
        editorial: "/search/images/editorial",
      };
      return this._makeRequest({
        $,
        path: pathMap[imageType] ?? "/search/images",
        params: {
          phrase,
          fields: fields.join(","),
          orientations: orientation,
          license_model: licenseModel,
          sort_order: sortOrder,
          page_size: pageSize,
        },
      });
    },
    downloadImage({
      $, imageId, productId,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: `/downloads/images/${imageId}`,
        params: {
          auto_download: false,
          product_id: productId,
        },
      });
    },
    getImage({
      $,
      imageId,
      fields = [
        "summary_set",
      ],
    }) {
      return this._makeRequest({
        $,
        path: `/images/${imageId}`,
        params: {
          fields: fields.join(","),
        },
      });
    },
    createCollection({
      $, name, description,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/boards",
        data: {
          name,
          description,
        },
      });
    },
  },
};
