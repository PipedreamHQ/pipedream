import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "referrizer",
  propDefinitions: {
    loyaltyRewardId: {
      type: "string",
      label: "Loyalty Reward ID",
      description: "The ID of the loyalty reward",
      async options({ prevContext }) {
        const { items } = await this.listLoyaltyRewards({
          page: prevContext.page || 0,
        });
        return {
          options: items.map((reward) => ({
            label: reward.title,
            value: reward.id,
          })),
          context: {
            page: items.length
              ? prevContext.page + 1
              : prevContext.page,
          },
        };
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({ prevContext }) {
        const { items } = await this.listContacts({
          page: prevContext.page || 0,
        });
        return {
          options: items.map((contact) => ({
            label: contact.name,
            value: contact.id,
          })),
          context: {
            page: items.length
              ? prevContext.page + 1
              : prevContext.page,
          },
        };
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the loyalty reward",
      required: true,
    },
    points: {
      type: "integer",
      label: "Points",
      description: "The number of points required for the reward",
      required: true,
    },
    quantityTotal: {
      type: "integer",
      label: "Total Quantity",
      description: "The total quantity of the loyalty reward",
      required: true,
    },
    quantityPerContact: {
      type: "integer",
      label: "Quantity Per Contact",
      description: "The quantity of the loyalty reward per contact",
      required: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the loyalty reward",
      required: true,
    },
    expiredDate: {
      type: "string",
      label: "Expired Date",
      description: "The expiration date of the loyalty reward",
      required: true,
    },
    expires: {
      type: "boolean",
      label: "Expires",
      description: "Whether the loyalty reward expires",
      required: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the loyalty reward",
      required: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value of the loyalty reward",
      required: true,
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of the item associated with the loyalty reward",
      optional: true,
    },
    itemName: {
      type: "string",
      label: "Item Name",
      description: "The name of the item associated with the loyalty reward",
      optional: true,
    },
    pin: {
      type: "string",
      label: "PIN",
      description: "The PIN required to redeem the loyalty reward",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note about the loyalty reward redemption",
      optional: true,
    },
    invitationMessage: {
      type: "string",
      label: "Invitation Message",
      description: "The message to send with the invitation to the contact",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.referrizer.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async listLoyaltyRewards({ page }) {
      return this._makeRequest({
        path: "/loyalty_rewards",
        params: {
          page,
        },
      });
    },
    async listContacts({ page }) {
      return this._makeRequest({
        path: "/contacts",
        params: {
          page,
        },
      });
    },
    async createLoyaltyReward({
      title,
      points,
      quantityTotal,
      quantityPerContact,
      startDate,
      expiredDate,
      expires,
      type,
      value,
      itemId,
      itemName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/loyalty_rewards",
        data: {
          title,
          points,
          quantity: {
            total: quantityTotal,
            perContact: quantityPerContact,
          },
          startDate,
          expiredDate,
          expires,
          type,
          value,
          item: itemId
            ? {
              id: itemId,
              name: itemName,
            }
            : undefined,
        },
      });
    },
    async updateLoyaltyReward({
      loyaltyRewardId,
      points,
      quantityTotal,
      quantityPerContact,
      startDate,
      expiredDate,
      expires,
      type,
      value,
      itemId,
      itemName,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/loyalty_rewards/${loyaltyRewardId}`,
        data: {
          points,
          quantity: {
            total: quantityTotal,
            perContact: quantityPerContact,
          },
          startDate,
          expiredDate,
          expires,
          type,
          value,
          item: itemId
            ? {
              id: itemId,
              name: itemName,
            }
            : undefined,
        },
      });
    },
    async redeemLoyaltyReward({
      loyaltyRewardId,
      contactId,
      pin,
      note,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/loyalty_rewards/${loyaltyRewardId}/redeem`,
        data: {
          contactId,
          pin,
          note,
        },
      });
    },
    async inviteContact({
      contactId,
      invitationMessage,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/invite`,
        data: invitationMessage
          ? {
            message: invitationMessage,
          }
          : {},
      });
    },
  },
  version: "0.0.{{ts}}",
};
