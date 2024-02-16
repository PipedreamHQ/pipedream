import app from "../linkedin/linkedin.app.mjs";
import utils from "./common/utils.mjs";

export default {
  ...app,
  type: "app",
  app: "linkedin_ads",
  propDefinitions: {
    ...app.propDefinitions,
    adAccountId: {
      type: "string",
      label: "Ad Account Id",
      description: "Sponsored ad account id to match results by",
      async options({
        page, mapper = ({
          id: value, name: label,
        }) => ({
          value,
          label,
        }),
      }) {
        const limit = 10;
        const { elements } = await this.searchAdAccounts({
          params: {
            count: 10,
            start: limit * page,
          },
        });
        return elements?.map(mapper);
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign Id",
      description: "Sponsored campaign account id to match results by",
      async options({
        page, adAccountId,
      }) {
        const count = 60;
        const { elements } = await this.searchCampaigns({
          adAccountId,
          params: {
            count,
            start: count * page,
            search: "(test:False)",
          },
        });
        return elements?.map(({
          name: label, id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    accounts: {
      type: "string[]",
      label: "Accounts",
      description: "An [Array of Account URN](https://docs.microsoft.com/en-us/linkedin/shared/references/v2/ads/adaccounts?context=linkedin/marketing/context). Required unless another facet is provided.",
      optional: true,
      async options() {
        const {
          searchAdAccounts,
          getSponsoredAccountUrn,
        } = this;
        const { elements } =  await searchAdAccounts();
        return elements.map(({
          id, name: label,
        }) => ({
          value: getSponsoredAccountUrn(id),
          label,
        }));
      },
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The ID of the event to retrieve registrations for.",
      async options({
        organizationId, page,
      }) {
        if (!organizationId) {
          return [];
        }
        const count = 20;
        const { elements } = await this.searchEvents({
          params: {
            q: "organizerLeadGenFormEnabledEvents",
            organizer: this.getOrganizationUrn(organizationId),
            count,
            start: page * count,
          },
        });
        return elements?.map(({
          id: value, localizedName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    conversionId: {
      type: "string",
      label: "Conversion ID",
      description: "The ID of the conversion event.",
      async options({
        adAccountId, page,
      }) {
        const count = 20;
        const { elements } = await this.searchConversions({
          params: {
            q: "account",
            account: this.getSponsoredAccountUrn(adAccountId),
            count,
            start: page * count,
          },
        });
        return elements?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    ...app.methods,
    getSponsoredAccountUrn(id) {
      return `urn:li:sponsoredAccount:${id}`;
    },
    getSponsoredCampaignUrn(id) {
      return `urn:li:sponsoredCampaign:${id}`;
    },
    getOrganizationUrn(id) {
      return `urn:li:organization:${id}`;
    },
    getConversionUrn(id) {
      return `urn:lla:llaPartnerConversion:${id}`;
    },
    getEventUrn(id) {
      return `urn:li:event:${id}`;
    },
    searchCampaigns({
      adAccountId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/adAccounts/${adAccountId}/adCampaigns?q=search`,
        ...args,
      });
    },
    searchLeadForms(args = {}) {
      const keys = [
        "owner",
      ];
      return this._makeRequest({
        debug: true,
        path: "/leadForms",
        paramsSerializer: utils.getParamsSerializer(utils.encodeParamKeys(keys)),
        ...args,
      });
    },
    searchEvents(args = {}) {
      const keys = [
        "organizer",
      ];
      return this._makeRequest({
        debug: true,
        path: "/events",
        paramsSerializer: utils.getParamsSerializer(utils.encodeParamKeys(keys)),
        transformResponse: utils.transformResponse,
        ...args,
      });
    },
    searchConversions(args = {}) {
      return this._makeRequest({
        debug: true,
        path: "/conversions",
        paramsSerializer: utils.getParamsSerializer(utils.encodeFn),
        ...args,
      });
    },
    searchLeadFormResponses(args = {}) {
      const keys = [
        "owner",
        "versionedLeadGenFormUrn",
        "associatedEntity",
      ];
      return this._makeRequest({
        debug: true,
        path: "/leadFormResponses",
        paramsSerializer: utils.getParamsSerializer(utils.encodeParamKeys(keys)),
        ...args,
      });
    },
  },
};
