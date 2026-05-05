import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tapfiliate",
  propDefinitions: {
    affiliateId: {
      type: "string",
      label: "Affiliate ID",
      description: "The ID of the affiliate",
      async options({ page }) {
        const affiliates = await this.listAffiliates({
          params: {
            page: page + 1,
          },
        });
        return affiliates?.map(({
          id, firstname, lastname, email,
        }) => ({
          label: `${firstname} ${lastname} (${email})`,
          value: id,
        })) || [];
      },
    },
    referralCode: {
      type: "string",
      label: "Referral Code",
      description: "An affiliate's referral code. This corresponds to the value of ref= in their referral link",
      async options({
        page, affiliateId,
      }) {
        if (!affiliateId) {
          return [];
        }
        const affiliates = await this.listPrograms({
          affiliateId,
          params: {
            page: page + 1,
          },
        });
        return affiliates?.map(({
          title, referral_link,
        }) => ({
          label: `${title}`,
          value: referral_link.link.split("ref=")[1],
        })) || [];
      },
    },
    programId: {
      type: "string",
      label: "Program ID",
      description: "The ID of the affiliate program",
      async options({ page }) {
        const programs = await this.listAllPrograms({
          params: {
            page: page + 1,
          },
        });
        return programs?.map(({
          id, title,
        }) => ({
          label: title,
          value: id,
        })) || [];
      },
    },
    conversionId: {
      type: "string",
      label: "Conversion ID",
      description: "The numeric ID of the conversion",
      async options({ page }) {
        const conversions = await this.listConversions({
          params: {
            page: page + 1,
          },
        });
        return conversions?.map(({
          id, external_id, amount,
        }) => ({
          label: `${external_id} - (Amount: ${amount})`,
          value: id,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tapfiliate.com/1.6";
    },
    _headers() {
      return {
        "X-Api-Key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers/",
        ...opts,
      });
    },
    listAffiliates(params = {}) {
      return this._makeRequest({
        path: "/affiliates/",
        params,
      });
    },
    listConversions(params = {}) {
      return this._makeRequest({
        path: "/conversions/",
        params,
      });
    },
    listAllPrograms(opts = {}) {
      return this._makeRequest({
        path: "/programs/",
        ...opts,
      });
    },
    listPrograms({
      affiliateId, ...opts
    }) {
      return this._makeRequest({
        path: `/affiliates/${affiliateId}/programs/`,
        ...opts,
      });
    },
    listProgramAffiliates({
      programId, ...opts
    }) {
      return this._makeRequest({
        path: `/programs/${programId}/affiliates/`,
        ...opts,
      });
    },
    setParentAffiliate({
      childAffiliateId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/affiliates/${childAffiliateId}/parent/`,
        ...opts,
      });
    },
    addCommissionToConversion({
      conversionId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/conversions/${conversionId}/commissions/`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
