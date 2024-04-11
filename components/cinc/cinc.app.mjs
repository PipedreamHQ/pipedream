import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cinc",
  propDefinitions: {
    leadId: {
      type: "string",
      label: "Lead Identifier",
      description: "The identifier for the lead",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { leads } = await this.listLeads({
          params: {
            limit,
            offset: page * limit,
          },
        });
        return leads?.map(({
          id: value, info,
        }) => ({
          value,
          label: `${info.contact.first_name} ${info.contact.last_name}`,
        })) || [];
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the lead",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the lead",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead",
    },
    cellphone: {
      type: "string",
      label: "Cellphone",
      description: "Cellphone number of the lead",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the lead",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source of the lead",
      optional: true,
    },
    medianListingPrice: {
      type: "string",
      label: "Median Listing Price",
      description: "Median listing price of the lead",
      optional: true,
    },
    averageListingPrice: {
      type: "string",
      label: "Average Listing Price",
      description: "Average listing price of the lead",
      optional: true,
    },
    isBuyerLead: {
      type: "boolean",
      label: "Is Buyer Lead",
      description: "Whether the lead is a buyer lead or not",
      optional: true,
    },
    isSellerLead: {
      type: "boolean",
      label: "Is Seller Lead",
      description: "Whether the lead is a seller lead or not",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://public.cincapi.com/v2/site";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    getLead({
      leadId, ...opts
    }) {
      return this._makeRequest({
        path: `/leads/${leadId}`,
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        ...opts,
      });
    },
    createLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/leads",
        ...opts,
      });
    },
  },
};
