import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "rev",
  propDefinitions: {
    externalLink: {
      type: "string",
      label: "External Link",
      description: "A link to a web page where the media is embedded, but not a link to the media file.",
    },
    audioLength: {
      type: "integer",
      label: "Audio Seconds Length",
      description: "Required, except for Youtube URLs.",
      optional: true,
    },
    videoLength: {
      type: "integer",
      label: "Video Seconds Length",
      description: "Required, except for Youtube URLs.",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference ID",
      description: "A reference number for the order, like the order ID tracked by another system.",
      optional: true,
    },
    notificationUrl: {
      type: "string",
      label: "Notification URL",
      description: "The url for notifications. Can be a Pipedream Webhook.",
      optional: true,
    },
    notificationLevel: {
      type: "string",
      label: "Notification Level",
      description: "Specifies which notifications are sent.",
      options: [
        {
          label: "A notification is sent whenever the order is in a new status or has a new comment.",
          value: "Detailed",
        },
        {
          label: "[Default] A notification is sent only when the order is complete.",
          value: "FinalOnly",
        },
      ],
      optional: true,
    },
    speakers: {
      type: "string[]",
      label: "Speakers",
      description: "List of speaker names.",
      optional: true,
    },
    accents: {
      type: "string[]",
      label: "Accents",
      description: "List speaker accents.",
      options: constants.ACCENTS,
      optional: true,
    },
    outputFormat: {
      type: "string[]",
      label: "Output File Formats",
      description: "The desired file formats for the finished transcription files.",
      options: constants.OUTPUT_FORMATS,
      optional: true,
    },
    rush: {
      type: "boolean",
      label: "Rush",
      description: "Should the order be rushed? Rush will deliver your files up to 5x faster. Requesting Rush adds $1.25 per audio minute to the cost of your orders.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rev.com/api/v1";
    },
    _auth() {
      return {
        Authorization: `Rev ${this.$auth.client_api_key}:${this.$auth.user_api_key}`,
      };
    },
    activateSandbox(d) {
      if (d != null) {
        d.sandbox_mode = true;
      }
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      /**
       * Activates sandbox mode to be able to make orders for free (test mode).
       * In production these two lines below should be commented.
       *
       * this.activateSandbox(opts.params);
       * this.activateSandbox(opts.data);
       */

      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          ...this._auth(),
        },
      });
    },
    async placeOrder(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/orders",
        method: "post",
        data: {
          ...opts.data,
        },
      });
    },
    async getOrders({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.getOrders,
          dataType: "orders",
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/orders",
      });
    },
    async paginate({
      fn, dataType, ...opts
    }) {
      const data = [];
      opts.params = {
        ...opts.params,
        pageSize: constants.MAX_PAGE_SIZE,
        page: 0,
      };

      while (true) {
        const response = await fn.call(this, opts);
        data.push(...response[dataType]);
        opts.params.page++;

        if (data.length >= response.total_count) {
          return {
            data,
          };
        }
      }
    },
  },
};
