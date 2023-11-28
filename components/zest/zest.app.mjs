import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zest",
  propDefinitions: {
    giftId: {
      type: "string",
      label: "Gift ID",
      description: "The unique identifier for the gift",
    },
    recipientAddress: {
      type: "string",
      label: "Recipient's Address",
      description: "The address where the gift will be delivered",
    },
    deliveryStatus: {
      type: "string",
      label: "Delivery Status",
      description: "Information about the gift's delivery status",
    },
    thankYouNoteId: {
      type: "string",
      label: "Thank You Note ID",
      description: "Unique identifier for the thank you note",
    },
    noteText: {
      type: "string",
      label: "Note Text",
      description: "The text of the thank you note",
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The identifier of the campaign to create the gift within",
    },
    giftMessage: {
      type: "string",
      label: "Gift Message",
      description: "A personalized note to include with the gift",
      optional: true,
    },
    giftType: {
      type: "string",
      label: "Gift Type",
      description: "The type of gift to be sent",
      optional: true,
      async options() {
        const giftTypes = await this.listGiftTypes();
        return giftTypes.map((giftType) => ({
          label: giftType.name,
          value: giftType.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://gifts.zest.co/api";
    },
    async _makeRequest({
      $ = this, method = "GET", path, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listGiftTypes() {
      return this._makeRequest({
        path: "/gift-types",
      });
    },
    async createGift({
      campaignId, giftMessage, giftType,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/gifts",
        data: {
          campaign_id: campaignId,
          gift_message: giftMessage,
          gift_type: giftType,
        },
      });
    },
    async emitGiftAccepted({ giftId }) {
      // Implementation for emitting an event when a gift is accepted
      // This would depend on the specific API endpoint and data requirements
    },
    async emitGiftDelivered({
      recipientAddress, deliveryStatus,
    }) {
      // Implementation for emitting an event when a gift is physically delivered
      // This would depend on the specific API endpoint and data requirements
    },
    async emitThankYouNoteSent({
      thankYouNoteId, noteText,
    }) {
      // Implementation for emitting an event when a recipient sends a thank you note
      // This would depend on the specific API endpoint and data requirements
    },
  },
};
