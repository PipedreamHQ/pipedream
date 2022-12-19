import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  Business,
  GetBusinessDetailsParams,
  HttpRequestParams,
  ListBusinessReviewsParams,
  ListBusinessReviewsResponse,
  PaginatedResponse,
  SearchBusinessesByPhoneParams,
  SearchBusinessesByPhoneResponse,
  SearchBusinessesParams,
  SearchBusinessesResponse,
} from "../common/types";
import { DOCS } from "../common/constants";

export default defineApp({
  type: "app",
  app: "yelp",
  methods: {
    _apiKey(): string {
      return this.$auth.api_key;
    },
    _baseUrl() {
      return "https://api.yelp.com/v3";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Authorization: `Bearer ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async _paginatedRequest({
      params, ...args
    }: SearchBusinessesParams) {
      const {
        maxResults, ...requestParams
      } = params;

      const result: Business[] = [];
      let offset = 0;
      let remainingResults = maxResults;
      let total: number;

      do {
        const limit = Math.min(50, remainingResults);

        const response: PaginatedResponse = await this._httpRequest({
          params: {
            ...requestParams,
            limit,
            offset,
          },
          ...args,
        });
        result.push(...response.businesses);

        if (offset === 0) {
          total = Number(response.total);
          remainingResults = Math.min(total, maxResults);
        }

        remainingResults -= limit;
        offset += limit;
      } while (remainingResults > 0);

      return {
        result,
        total,
      };
    },
    async searchBusinesses(
      args: SearchBusinessesParams,
    ): Promise<SearchBusinessesResponse> {
      return this._paginatedRequest({
        url: "/businesses/search",
        ...args,
      });
    },
    async searchBusinessesByPhoneNumber(
      args: SearchBusinessesByPhoneParams,
    ): Promise<SearchBusinessesByPhoneResponse> {
      return this._httpRequest({
        url: "/businesses/search/phone",
        ...args,
      });
    },
    async getBusinessDetails(
      {
        businessIdOrAlias, ...args
      }: GetBusinessDetailsParams,
    ): Promise<Business> {
      return this._httpRequest({
        url: `/businesses/${businessIdOrAlias}`,
        ...args,
      });
    },
    async listBusinessReviews(
      {
        businessIdOrAlias, ...args
      }: ListBusinessReviewsParams,
    ): Promise<ListBusinessReviewsResponse> {
      return this._httpRequest({
        url: `/businesses/${businessIdOrAlias}/reviews`,
        ...args,
      });
    },
  },
  propDefinitions: {
    businessIdOrAlias: {
      label: "Business ID or Alias",
      description:
        "A unique identifier for a Yelp Business. Can be either a 22-character Yelp Business ID, or a Yelp Business Alias.",
      type: "string",
    },
    locale: {
      label: "Locale",
      description: `Locale code in the format of *{language code}_{country code}* (e.g. \`en_US\`). [See the list of supported locales.](${DOCS.locales})`,
      type: "string",
      optional: true,
    },
  },
});
