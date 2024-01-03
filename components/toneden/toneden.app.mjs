import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "toneden",
  version: "0.0.{{ts}}",
  propDefinitions: {
    userId: {
      type: "integer",
      label: "User ID",
      description: "Numeric ID of the user whose ad campaigns will be retrieved.",
    },
    attachmentId: {
      type: "integer",
      label: "Attachment ID",
      description: "Numeric ID of the attachment to retrieve.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ad campaigns to retrieve.",
      options: [
        "active",
        "live",
        "recent",
        "paused",
        "error",
        "inactive",
        "scheduled",
      ],
      optional: true,
      default: "active",
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of records to skip for pagination.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The limit on the number of records to return.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.toneden.io/api/v1";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getUserAdCampaigns({
      userId, status, offset, limit,
    }) {
      return this._makeRequest({
        path: `/users/${userId}/advertising/campaigns`,
        params: {
          status,
          offset,
          limit,
        },
      });
    },
    async getAttachmentById({ attachmentId }) {
      return this._makeRequest({
        path: `/attachments/${attachmentId}`,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let moreData = true;
      let currentOffset = 0;

      while (moreData) {
        const {
          data, nextOffset,
        } = await fn(...opts, currentOffset);
        results = results.concat(data);
        if (typeof nextOffset !== "undefined") {
          currentOffset = nextOffset;
        } else {
          moreData = false;
        }
      }

      return results;
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
