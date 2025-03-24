import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "domain_group",
  propDefinitions: {
    agencyId: {
      type: "string",
      label: "Agency ID",
      description: "The identifier of an agency",
      async options() {
        const agencies = await this.listAgencies();
        return agencies.map((agency) => ({
          label: agency.name,
          value: agency.id,
        }));
      },
    },
    providerAdId: {
      type: "string",
      label: "Provider Ad ID",
      description: "Must be unique. If Provider Ad ID supplied already exists, the listing will be updated. External Advertisement Id of up to 50 characters will be stored.<br /> This value is used to identify an Advertisement for updates and should be unique for listing provider.<br /> This value is case-insensitive (meaning AAAA will update aaaa).",
    },
    listingAction: {
      type: "string",
      label: "Listing Action",
      description: "The type of listing action",
      options: [
        "sale",
        "rent",
        "saleAndLease",
      ],
    },
    propertyType: {
      type: "string",
      label: "Property Type",
      description: "The type of property",
    },
    underOfferOrContract: {
      type: "boolean",
      label: "Under Offer or Contract",
      description: "Set for Sale listings only",
      optional: true,
    },
    nabers: {
      type: "string",
      label: "NABERS",
      description: "The NABERS Rating is the energy efficiency rating that the property has been measured to have. This rating is measured in increments of .5 and can range from 0 to 6. The NABERS rating is required for spaces within office buildings of 1000 square metres or more. For more information on the NABERS rating system please visit [http://www.nabers.gov.au](http://www.nabers.gov.au)",
      optional: true,
    },
    fromPrice: {
      type: "integer",
      label: "From Price",
      description: "Lowest price the property is expected to sell/rent for to set search price. For a fixed price, set this value the same as To Price",
    },
    toPrice: {
      type: "integer",
      label: "To Price",
      description: "Highest price the property is expected to sell/rent for to set search price. For a fixed price, set this value the same as From Price",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the property",
      optional: true,
    },
    features: {
      type: "string",
      label: "Features",
      description: "Comma-separated list of features",
      optional: true,
    },
    streetNumber: {
      type: "string",
      label: "Street Number",
      description: "Street number of the listing address",
    },
    unitNumber: {
      type: "string",
      label: "Unit Number",
      description: "Unit number of the listing address",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "Street of the listing address",
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the listing address",
      options: [
        "nsw",
        "vic",
        "act",
        "sa",
        "wa",
        "tas",
        "qld",
        "nt",
      ],
    },
    suburb: {
      type: "string",
      label: "Suburb",
      description: "Suburb of the listing address",
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "Post code of the listing address",
    },
    receiveEmailsToDefaultAddress: {
      type: "boolean",
      label: "Receive Emails to Default Address",
      description: "Send email enquiries to the default address for this listing type",
      optional: true,
    },
    isRural: {
      type: "boolean",
      label: "Is Rural?",
      description: "True if the property is rural",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}`;
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listAgencies() {
      return this._makeRequest({
        path: "/v1/me/agencies",
      });
    },
    listAgencyListings({
      agencyId, ...opts
    }) {
      return this._makeRequest({
        path: `/v1/agencies/${agencyId}/listings`,
        ...opts,
      });
    },
    createBusinessListing(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/v1/listings/business",
        ...opts,
      });
    },
    createResidentialListing(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/v1/listings/residential",
        ...opts,
      });
    },
    createCommercialListing(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/v2/listings/commercial",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      max,
    }) {
      let total, count = 0;
      args = {
        ...args,
        params: {
          ...args.params,
          pageNumber: 1,
        },
      };
      do {
        const items = await resourceFn(args);
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        total = items.length;
        args.params.pageNumber++;
      } while (total);
    },
  },
};
