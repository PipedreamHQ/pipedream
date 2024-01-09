import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "referrizer",
  propDefinitions: {
    loyaltyRewardId: {
      type: "string",
      label: "Loyalty Reward ID",
      description: "The ID of the loyalty reward",
      async options({ page }) {
        const items = await this.listLoyaltyRewards({
          page: page + 1,
        });

        return items.map(({
          title: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({ page }) {
        const items = await this.listContacts({
          page: page + 1,
        });
        return items.map(({
          id: value, firstName, lastName, email,
        }) => ({
          label: `${firstName} ${lastName} ${email}`,
          value,
        }));
      },
    },
    expires: {
      type: "boolean",
      label: "Expires",
      description: "Whether the loyalty reward expires",
    },
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of the item associated with the loyalty reward",
    },
    itemName: {
      type: "string",
      label: "Item Name",
      description: "The name of the item associated with the loyalty reward",
    },
    points: {
      type: "integer",
      label: "Points",
      description: "The number of points required for the reward",
    },
    quantityTotal: {
      type: "integer",
      label: "Total Quantity",
      description: "The total quantity of the loyalty reward",
    },
    quantityPerContact: {
      type: "integer",
      label: "Quantity Per Contact",
      description: "The quantity of the loyalty reward per contact",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the loyalty reward. `Format YYYY-MM-DDTHH:MM:SS.SSSZ`",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the loyalty reward",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the loyalty reward",
      options: [
        "ITEM",
        "CASH_DISCOUNT",
        "PERCENT_DISCOUNT",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.referrizer.com/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listLoyaltyRewards(opts = {}) {
      return this._makeRequest({
        path: "/loyalty-rewards",
        ...opts,
      });
    },
    listRedeemedLoyaltyRewards(opts = {}) {
      return this._makeRequest({
        path: "/loyalty-rewards/redeems",
        ...opts,
      });
    },
    listContacts({ page }) {
      return this._makeRequest({
        path: "/contacts",
        params: {
          page,
        },
      });
    },
    createLoyaltyReward(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/loyalty-rewards",
        ...opts,
      });
    },
    getLoyaltyReward({ loyaltyRewardId }) {
      return this._makeRequest({
        path: `/loyalty-rewards/${loyaltyRewardId}`,
      });
    },
    updateLoyaltyReward({
      loyaltyRewardId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/loyalty-rewards/${loyaltyRewardId}`,
        ...opts,
      });
    },
    createVisit(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/visits",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMode = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMode = data.length;

      } while (hasMode);
    },
  },
};
