import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "streamlabs",
  version: "0.0.{{ts}}",
  propDefinitions: {
    minTipAmount: {
      type: "integer",
      label: "Minimum Tip Amount",
      description: "Filter tips by a minimum amount",
      optional: true,
    },
    subscriptionPlanTier: {
      type: "integer",
      label: "Subscription Plan Tier",
      description: "Filter subscriptions by plan tier",
      optional: true,
    },
    alertMessageContent: {
      type: "string",
      label: "Alert Message Content",
      description: "The message content for the alert",
    },
    alertImageUrl: {
      type: "string",
      label: "Alert Image URL",
      description: "URL of the image to include in the alert",
      optional: true,
    },
    alertSoundUrl: {
      type: "string",
      label: "Alert Sound URL",
      description: "URL of the sound to play in the alert",
      optional: true,
    },
    overlayId: {
      type: "string",
      label: "Overlay ID",
      description: "The ID of the overlay to update",
    },
    contentUpdates: {
      type: "object",
      label: "Content Updates",
      description: "The content updates for the overlay (e.g., text, images, stats)",
    },
    streamTitle: {
      type: "string",
      label: "Stream Title",
      description: "The title of the live stream",
    },
    gameCategory: {
      type: "string",
      label: "Game/Category",
      description: "The game or category information for the live stream",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://streamlabs.com/api/v2.0";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async emitTipEvent(opts = {}) {
      const { minTipAmount } = opts;
      const params = minTipAmount
        ? {
          min_amount: minTipAmount,
        }
        : {};
      return this._makeRequest({
        method: "GET",
        path: "/tip_event",
        params,
        ...opts,
      });
    },
    async emitFollowEvent(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/follow_event",
        ...opts,
      });
    },
    async emitSubscribeEvent(opts = {}) {
      const { subscriptionPlanTier } = opts;
      const params = subscriptionPlanTier
        ? {
          tier: subscriptionPlanTier,
        }
        : {};
      return this._makeRequest({
        method: "GET",
        path: "/subscribe_event",
        params,
        ...opts,
      });
    },
    async sendAlert(opts = {}) {
      const {
        alertMessageContent, alertImageUrl, alertSoundUrl,
      } = opts;
      const data = {
        message: alertMessageContent,
      };
      if (alertImageUrl) data.image_url = alertImageUrl;
      if (alertSoundUrl) data.sound_url = alertSoundUrl;
      return this._makeRequest({
        method: "POST",
        path: "/alerts",
        data,
        ...opts,
      });
    },
    async updateOverlay(opts = {}) {
      const {
        overlayId, contentUpdates,
      } = opts;
      return this._makeRequest({
        method: "PUT",
        path: `/overlays/${overlayId}`,
        data: contentUpdates,
        ...opts,
      });
    },
    async startLiveStream(opts = {}) {
      const {
        streamTitle, gameCategory,
      } = opts;
      const data = {
        title: streamTitle,
      };
      if (gameCategory) data.game_category = gameCategory;
      return this._makeRequest({
        method: "POST",
        path: "/streams/start",
        data,
        ...opts,
      });
    },
    paginate(fn, ...opts) {
      let results = [];
      const fetchPage = async (params = {}) => {
        const response = await fn({
          ...params,
          ...opts,
        });
        if (response && response.length > 0) {
          results = results.concat(response);
          if (response.next_page) {
            await fetchPage({
              page: response.next_page,
            });
          }
        }
      };
      return fetchPage().then(() => results);
    },
    async authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
