import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import {
  formatAmount, getItems,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "rewardful",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The UUID of the campaign, e.g. `c3482343-8680-40c5-af9a-9efa119713b5`. Use **List Campaigns** to find it (the `id` field).",
      async options({ page }) {
        const response = await this.listCampaigns({
          params: {
            page: page + 1,
          },
        });
        return getItems(response).map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    affiliateId: {
      type: "string",
      label: "Affiliate ID",
      description: "The UUID of the affiliate, e.g. `aaac9869-4242-4db9-afb1-f3518ef627c5`. Use **List Affiliates** to find it (the `id` field).",
      async options({ page }) {
        const response = await this.listAffiliates({
          params: {
            page: page + 1,
            limit: constants.MAX_LIMIT,
          },
        });
        return getItems(response).map(({
          id: value, first_name: firstName, last_name: lastName, email,
        }) => ({
          label: `${firstName} ${lastName} (${email})`,
          value,
        }));
      },
    },
    affiliateLinkId: {
      type: "string",
      label: "Affiliate Link ID",
      description: "The UUID of the affiliate link, e.g. `f46a912b-08bc-4332-8771-c857e11ad9dd`. Use **List Affiliate Links** to find it (the `id` field).",
      async options({ page }) {
        const response = await this.listAffiliateLinks({
          params: {
            page: page + 1,
            limit: constants.MAX_LIMIT,
          },
        });
        return getItems(response).map(({
          id: value, url: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    affiliateCouponId: {
      type: "string",
      label: "Affiliate Coupon ID",
      description: "The UUID of the affiliate coupon, e.g. `75434e84-255b-4314-a278-820df5e76813`. Use **List Affiliate Coupons** to find it (the `id` field).",
      async options({ page }) {
        const response = await this.listAffiliateCoupons({
          params: {
            page: page + 1,
            limit: constants.MAX_LIMIT,
          },
        });
        return getItems(response).map(({
          id: value, token: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    commissionId: {
      type: "string",
      label: "Commission ID",
      description: "The UUID of the commission, e.g. `39e68c88-d84a-4510-b3b4-43c75016a080`. Use **List Commissions** to find it (the `id` field).",
      async options({ page }) {
        const response = await this.listCommissions({
          params: {
            page: page + 1,
            limit: constants.MAX_LIMIT,
          },
        });
        return getItems(response).map(({
          id: value, amount, currency, state,
        }) => ({
          label: `${formatAmount(amount, currency)} (${state}) - ${value}`,
          value,
        }));
      },
    },
    payoutId: {
      type: "string",
      label: "Payout ID",
      description: "The UUID of the payout, e.g. `3b03791a-3fb5-4bd6-8ec3-614c9fd978ca`. Use **List Payouts** to find it (the `id` field).",
      async options({ page }) {
        const response = await this.listPayouts({
          params: {
            page: page + 1,
            limit: constants.MAX_LIMIT,
          },
        });
        return getItems(response).map(({
          id: value, amount, currency, state,
        }) => ({
          label: `${formatAmount(amount, currency)} (${state}) - ${value}`,
          value,
        }));
      },
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to return, starting at `1`, e.g. `2`. Read `pagination.next_page` from the previous response to get the next page number.",
      min: 1,
      default: 1,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The number of results to return per page, e.g. \`50\`. Defaults to \`${constants.DEFAULT_LIMIT}\`, maximum \`${constants.MAX_LIMIT}\`.`,
      min: 1,
      max: constants.MAX_LIMIT,
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Related objects to include as nested objects in each result, e.g. `[\"affiliate\"]`.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The affiliate's first name, e.g. `James`.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The affiliate's last name, e.g. `Bond`.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The affiliate's email address, e.g. `james@example.com`.",
    },
    affiliateState: {
      type: "string",
      label: "State",
      description: "The affiliate's state. One of `active`, `disabled`, `suspicious`, e.g. `active`. Disabled and suspicious affiliates are not tracked, cannot earn commissions, and cannot log in.",
      options: constants.AFFILIATE_STATES,
      optional: true,
    },
    stripeCustomerId: {
      type: "string",
      label: "Stripe Customer ID",
      description: "The Stripe customer ID, used for customer referral programs, e.g. `cus_ABC123`. Found on the customer's page in the Stripe dashboard.",
      optional: true,
    },
    token: {
      type: "string",
      label: "Token",
      description: "The code used in the affiliate link, e.g. `jb007` produces links like `?via=jb007`. Must contain only letters, numbers, and dashes.",
    },
    paypalEmail: {
      type: "string",
      label: "PayPal Email",
      description: "The PayPal address that commissions should be paid to, e.g. `james@example.com`.",
      optional: true,
    },
    wiseEmail: {
      type: "string",
      label: "Wise Email",
      description: "The Wise address that commissions should be paid to, e.g. `james@example.com`.",
      optional: true,
    },
    campaignName: {
      type: "string",
      label: "Name",
      description: "The campaign's name, e.g. `Friends of MI6`.",
    },
    campaignUrl: {
      type: "string",
      label: "URL",
      description: "The base URL used to generate affiliate links for the campaign, e.g. `https://www.example.com`.",
    },
    isPrivate: {
      type: "boolean",
      label: "Private",
      description: "Set to `true` to make the campaign invite-only, or `false` to open it to the public, e.g. `false`.",
      optional: true,
    },
    rewardType: {
      type: "string",
      label: "Reward Type",
      description: "The type of reward for the campaign. One of `percent` (a percentage of each sale, set `commissionPercent`) or `amount` (a fixed amount, set `commissionAmountCents` and `commissionAmountCurrency`), e.g. `percent`.",
      options: constants.REWARD_TYPES,
    },
    commissionPercent: {
      type: "string",
      label: "Commission Percent",
      description: "The commission percentage for the campaign, e.g. `20` or `12.5`. Required when `rewardType` is `percent`.",
      optional: true,
    },
    commissionAmountCents: {
      type: "integer",
      label: "Commission Amount (Cents)",
      description: "The fixed commission amount in cents, e.g. `1500` for 15.00. Required when `rewardType` is `amount`.",
      optional: true,
    },
    commissionAmountCurrency: {
      type: "string",
      label: "Commission Amount Currency",
      description: "The ISO 4217 currency code of the fixed commission, e.g. `USD`. Required when `rewardType` is `amount`.",
      optional: true,
    },
    minimumPayoutCents: {
      type: "integer",
      label: "Minimum Payout (Cents)",
      description: "The minimum total of commissions, in cents of your company's display currency, an affiliate needs before receiving a payout, e.g. `5000`. Defaults to `0`.",
      optional: true,
    },
    stripeCouponId: {
      type: "string",
      label: "Stripe Coupon ID",
      description: "The ID of the Stripe coupon used for double-sided incentives, e.g. `SUMMER20`. Found on the coupon's page in the Stripe dashboard. Only available on Rewardful's Growth and Enterprise plans.",
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $ = this, ...args
    }) {
      return axios($, {
        baseURL: constants.BASE_URL,
        auth: {
          username: this.$auth.api_secret,
          password: "",
        },
        ...args,
      });
    },
    listCampaigns(args = {}) {
      return this._makeRequest({
        url: "/campaigns",
        ...args,
      });
    },
    getCampaign({
      campaignId, ...args
    }) {
      return this._makeRequest({
        url: `/campaigns/${campaignId}`,
        ...args,
      });
    },
    createCampaign(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/campaigns",
        ...args,
      });
    },
    updateCampaign({
      campaignId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/campaigns/${campaignId}`,
        ...args,
      });
    },
    listAffiliates(args = {}) {
      return this._makeRequest({
        url: "/affiliates",
        ...args,
      });
    },
    getAffiliate({
      affiliateId, ...args
    }) {
      return this._makeRequest({
        url: `/affiliates/${affiliateId}`,
        ...args,
      });
    },
    createAffiliate(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/affiliates",
        ...args,
      });
    },
    updateAffiliate({
      affiliateId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/affiliates/${affiliateId}`,
        ...args,
      });
    },
    getAffiliateMagicLink({
      affiliateId, ...args
    }) {
      return this._makeRequest({
        url: `/affiliates/${affiliateId}/sso`,
        ...args,
      });
    },
    listAffiliateLinks(args = {}) {
      return this._makeRequest({
        url: "/affiliate_links",
        ...args,
      });
    },
    getAffiliateLink({
      affiliateLinkId, ...args
    }) {
      return this._makeRequest({
        url: `/affiliate_links/${affiliateLinkId}`,
        ...args,
      });
    },
    createAffiliateLink(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/affiliate_links",
        ...args,
      });
    },
    updateAffiliateLink({
      affiliateLinkId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/affiliate_links/${affiliateLinkId}`,
        ...args,
      });
    },
    listAffiliateCoupons(args = {}) {
      return this._makeRequest({
        url: "/affiliate_coupons",
        ...args,
      });
    },
    getAffiliateCoupon({
      affiliateCouponId, ...args
    }) {
      return this._makeRequest({
        url: `/affiliate_coupons/${affiliateCouponId}`,
        ...args,
      });
    },
    createAffiliateCoupon(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/affiliate_coupons",
        ...args,
      });
    },
    listReferrals(args = {}) {
      return this._makeRequest({
        url: "/referrals",
        ...args,
      });
    },
    listCommissions(args = {}) {
      return this._makeRequest({
        url: "/commissions",
        ...args,
      });
    },
    getCommission({
      commissionId, ...args
    }) {
      return this._makeRequest({
        url: `/commissions/${commissionId}`,
        ...args,
      });
    },
    updateCommission({
      commissionId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/commissions/${commissionId}`,
        ...args,
      });
    },
    deleteCommission({
      commissionId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        url: `/commissions/${commissionId}`,
        ...args,
      });
    },
    listPayouts(args = {}) {
      return this._makeRequest({
        url: "/payouts",
        ...args,
      });
    },
    getPayout({
      payoutId, ...args
    }) {
      return this._makeRequest({
        url: `/payouts/${payoutId}`,
        ...args,
      });
    },
    markPayoutAsPaid({
      payoutId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        url: `/payouts/${payoutId}/pay`,
        ...args,
      });
    },
  },
};
