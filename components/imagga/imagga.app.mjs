import { axios } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";

export default {
  type: "app",
  app: "imagga",
  propDefinitions: {
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "The ticket ID to track the status of the image processing batch",
    },
    imageProcessType: {
      type: "string",
      label: "Image Process Type",
      description: "The type of image processing to perform",
      options: [
        {
          label: "Tags",
          value: "tags",
        },
        {
          label: "Categories",
          value: "categories",
        },
        {
          label: "Colors",
          value: "colors",
        },
      ],
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image to analyze",
    },
    imageFile: {
      type: "string",
      label: "Image File",
      description: "The file path of the image to analyze",
    },
    categorizerId: {
      type: "string",
      label: "Categorizer ID",
      description: "The ID of the categorizer to use",
      async options() {
        const response = await this.listCategorizers();
        return response.map((categorizer) => ({
          label: categorizer.name,
          value: categorizer.id,
        }));
      },
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "The callback URL to be invoked after batch processing",
    },
    imageUrls: {
      type: "string[]",
      label: "Image URLs",
      description: "The URLs of the images to analyze in a batch",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.imagga.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
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
          Authorization: `Basic ${Buffer.from(`${this.$auth.api_key}:`).toString("base64")}`,
        },
        data,
        params,
      });
    },
    async listCategorizers() {
      return this._makeRequest({
        path: "/categorizers",
      });
    },
    async analyzeImage({
      imageProcessType, imageUrl, imageFile,
    }) {
      const formData = new FormData();
      if (imageUrl) {
        formData.append("image_url", imageUrl);
      } else if (imageFile) {
        formData.append("image", fs.createReadStream(imageFile));
      }
      return this._makeRequest({
        method: "POST",
        path: `/${imageProcessType}`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
    },
    async analyzeBatch({
      imageUrls, imageProcessType, callbackUrl,
    }) {
      const processingRequests = imageUrls.map((imageUrl) => ({
        params: {
          image_url: imageUrl,
        },
      }));
      return this._makeRequest({
        method: "POST",
        path: "/batches",
        data: {
          technology_endpoints: [
            {
              endpoint: `/${imageProcessType}`,
              params: processingRequests,
            },
          ],
          callback_url: callbackUrl,
        },
      });
    },
    async assignCategory({
      imageUrl, categorizerId, callbackUrl,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/categorizers/${categorizerId}`,
        params: {
          image_url: imageUrl,
          callback_url: callbackUrl,
        },
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let response;
      do {
        response = await fn(...opts);
        results = results.concat(response.result);
        opts.page = response.next_page;
      } while (response.next_page);
      return results;
    },
  },
  version: "0.0.{{ts}}",
};
