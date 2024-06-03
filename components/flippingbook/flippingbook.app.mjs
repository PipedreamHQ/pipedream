import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flippingbook",
  propDefinitions: {
    flipbookId: {
      type: "string",
      label: "Flipbook ID",
      description: "The unique identifier of the flipbook.",
      required: true,
    },
    trackableLink: {
      type: "string",
      label: "Trackable Link",
      description: "The unique link that the user wants to track.",
      required: true,
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "The unique identifier of the form where the lead was captured from.",
      required: true,
    },
    leadDetails: {
      type: "object",
      label: "Lead Details",
      description: "The details of the lead captured from the form.",
      optional: true,
    },
    pdfFile: {
      type: "string",
      label: "PDF File",
      description: "The input PDF file to generate a new flipbook or replace an existing one. The maximum size is 100MB.",
      required: true,
    },
    flipbookTitle: {
      type: "string",
      label: "Flipbook Title",
      description: "The title of the flipbook to locate.",
      required: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flippingbook.com";
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
          Authorization: this.$auth.api_token,
        },
      });
    },
    async createFlipbook(opts) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/api/v1/fbonline/publications",
      });
    },
    async updateFlipbook(opts) {
      return this._makeRequest({
        ...opts,
        method: "PUT",
        path: `/api/v1/fbonline/publications/${opts.flipbookId}`,
      });
    },
    async getFlipbook(opts) {
      return this._makeRequest({
        ...opts,
        path: `/api/v1/fbonline/publications/${opts.flipbookId}`,
      });
    },
    async createTrackedLink(opts) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/api/v1/fbonline/tracked_links",
      });
    },
    async getTrackedLink(opts) {
      return this._makeRequest({
        ...opts,
        path: `/api/v1/fbonline/tracked_links/${opts.linkId}`,
      });
    },
  },
};
