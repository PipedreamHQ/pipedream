import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dataforseo",
  propDefinitions: {
    locationCode: {
      type: "integer",
      label: "Location Code",
      description: "The code of the target location",
      async options() {
        const response = await this.getLocations();
        const languageCodes = response.tasks[0].result;
        return languageCodes.map(({
          location_name, location_code,
        }) => ({
          value: location_code,
          label: location_name,
        }));
      },
    },
    tripAdvisorLocationCode: {
      type: "integer",
      label: "Location Code",
      description: "The code of the target location",
      async options({ countryCode }) {
        const response = await this.getTripadvisorLocations({
          countryCode,
        });
        const locationCodes = response.tasks[0].result;
        return locationCodes?.map(({
          location_name, location_code,
        }) => ({
          value: location_code,
          label: location_name,
        })) || [];
      },
    },
    locationCoordinate: {
      type: "string",
      label: "Location Coordinate",
      description: "The location to search, in the format `latitude,longitude,radius` where radius is specified in kilometers. Example: `53.476225,-2.243572,200`",
    },
    targetType: {
      type: "string",
      label: "Target Type",
      description: "The type of the target",
      options: constants.TARGET_TYPES,
    },
    target: {
      type: "string",
      label: "Target",
      description: "The domain name or the url of the target website or page. The domain should be specified without https:// and www.",
    },
    backlinksTarget: {
      type: "string",
      label: "Target",
      description: "Domain, subdomain or webpage to get data for. A domain or a subdomain should be specified without `https://` and `www`. A page should be specified with absolute URL (including `http://` or `https://`)",
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "The categories you specify are used to search for business listings",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the business entity for which the results are collected",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The name of the business entity for which the results are collected",
      optional: true,
    },
    isClaimed: {
      type: "boolean",
      label: "Is Claimed",
      description: "Indicates whether the business is verified by its owner on Google Maps",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of results to return. Maximum: 1000",
      optional: true,
    },
    languageCode: {
      type: "string",
      label: "Language Code",
      description: "The language code for the request",
      async options() {
        const response = await this.getLanguageCode();
        const languageCodes = response.tasks[0].result;
        return languageCodes.map(({
          language_name, language_code,
        }) => ({
          value: language_code,
          label: language_name,
        }));
      },
    },
    keywords: {
      type: "string[]",
      label: "Keywords",
      description: "Target Keywords. The maximum number of keywords is 1000",
    },
    backlinksFilters: {
      type: "string[]",
      label: "Backlinks Filters",
      description:
        "You can use this field to filter the initial backlinks that will be included in the dataset for aggregated metrics for your target. [See the documentation](https://docs.dataforseo.com/v3/backlinks/filters/) for more information. Example: `[\"dofollow\", \"=\", true]`",
      optional: true,
    },
    rankScale: {
      type: "string",
      label: "Rank Scale",
      description: "Whether rank values are presented on a 0-100 or 0-1000 scale",
      optional: true,
      options: [
        "one_hundred",
        "one_thousand",
      ],
      default: "one_thousand",
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "You can use this parameter to identify the task and match it with the result.",
      optional: true,
    },
    includeSubdomains: {
      type: "boolean",
      label: "Include Subdomains",
      description: "Whether the subdomains of the `target` will be included in the search. Default is `true`",
      optional: true,
    },
    includeIndirectLinks: {
      type: "boolean",
      label: "Include Indirect Links",
      description: "Whether indirect links to the target will be included in the results. Default is `true`",
      optional: true,
    },
    excludeInternalBacklinks: {
      type: "boolean",
      label: "Exclude Internal Backlinks",
      description: "Indicates if internal backlinks from subdomains to the target will be excluded from the results. Default is `true`",
      optional: true,
    },
    backlinksStatusType: {
      type: "string",
      label: "Backlinks Status Type",
      description: "You can use this field to choose what backlinks will be returned and used for aggregated metrics for your target",
      optional: true,
      options: [
        {
          value: "all",
          label: "All backlinks will be returned and counted",
        },
        {
          value: "live",
          label:
            "Backlinks found during the last check will be returned and counted",
        },
        {
          value: "lost",
          label: "Lost backlinks will be returned and counted",
        },
      ],
      default: "live",
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to send in the request. See the documentation for all available parameters. Values will be parsed as JSON where applicable.",
      optional: true,
    },
    targets: {
      type: "string[]",
      label: "Targets",
      description: "Up to 1000 domains, subdomains or webpages to get data for. A domain or a subdomain should be specified without `https://` and `www`. A page should be specified with absolute URL (including `http://` or `https://`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.dataforseo.com/v3";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          username: `${this.$auth.api_login}`,
          password: `${this.$auth.api_password}`,
        },
      });
    },
    getKeywordDifficulty(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/bulk_keyword_difficulty/live",
        method: "post",
        ...args,
      });
    },
    getBusinessListings(args = {}) {
      return this._makeRequest({
        path: "/business_data/business_listings/search/live",
        method: "post",
        ...args,
      });
    },
    getRankedKeywords(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/keywords_for_site/live",
        method: "post",
        ...args,
      });
    },
    getLanguageCode(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/languages",
        ...args,
      });
    },
    getLocations(args = {}) {
      return this._makeRequest({
        path: "/serp/google/ads_search/locations",
        ...args,
      });
    },
    getKeywordDataIdList(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/id_list",
        method: "post",
        ...args,
      });
    },
    getKeywordDataErrors(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/errors",
        method: "post",
        ...args,
      });
    },
    getGoogleAdsStatus(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/status",
        ...args,
      });
    },
    getGoogleAdsLocations({
      countryCode, ...args
    }) {
      return this._makeRequest({
        path: `/keywords_data/google_ads/locations/${countryCode}`,
        ...args,
      });
    },
    getTripadvisorLocations({
      countryCode, ...args
    }) {
      return this._makeRequest({
        path: `/business_data/tripadvisor/locations/${countryCode}`,
        ...args,
      });
    },
    getGoogleAdsLanguages(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/languages",
        ...args,
      });
    },
    getGoogleAdsSearchVolume(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/search_volume/live",
        method: "post",
        ...args,
      });
    },
    getGoogleAdsSearchVolumeCompletedTasks(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/search_volume/tasks_ready",
        ...args,
      });
    },
    getGoogleAdsKeywordsForSiteCompletedTasks(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/keywords_for_site/tasks_ready",
        ...args,
      });
    },
    getGoogleAdsKeywordsForKeywords(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/keywords_for_keywords/live",
        method: "post",
        ...args,
      });
    },
    getGoogleAdsKeywordsForKeywordsCompletedTasks(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/keywords_for_keywords/tasks_ready",
        ...args,
      });
    },
    getGoogleAdsAdTrafficByKeywords(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/ad_traffic_by_keywords/live",
        method: "post",
        ...args,
      });
    },
    getGoogleAdsAdTrafficByKeywordsCompletedTasks(args = {}) {
      return this._makeRequest({
        path: "/keywords_data/google_ads/ad_traffic_by_keywords/tasks_ready",
        ...args,
      });
    },
    getGoogleOrganicResults(args = {}) {
      return this._makeRequest({
        path: "/serp/google/organic/live/regular",
        method: "post",
        ...args,
      });
    },
    getGoogleImagesResults(args = {}) {
      return this._makeRequest({
        path: "/serp/google/images/live/advanced",
        method: "post",
        ...args,
      });
    },
    getGoogleNewsResults(args = {}) {
      return this._makeRequest({
        path: "/serp/google/news/live/advanced",
        method: "post",
        ...args,
      });
    },
    getBingOrganicResults(args = {}) {
      return this._makeRequest({
        path: "/serp/bing/organic/live/regular",
        method: "post",
        ...args,
      });
    },
    getYahooOrganicResults(args = {}) {
      return this._makeRequest({
        path: "/serp/yahoo/organic/live/regular",
        method: "post",
        ...args,
      });
    },
    getDomainRankOverview(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/domain_rank_overview/live",
        method: "post",
        ...args,
      });
    },
    getCompetitorDomains(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/competitors_domain/live",
        method: "post",
        ...args,
      });
    },
    getDomainKeywords(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/ranked_keywords/live",
        method: "post",
        ...args,
      });
    },
    getKeywordSuggestions(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/keyword_suggestions/live",
        method: "post",
        ...args,
      });
    },
    getHistoricalSerpData(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/historical_serps/live",
        method: "post",
        ...args,
      });
    },
    getDomainIntersection(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/domain_intersection/live",
        method: "post",
        ...args,
      });
    },
    getTopSerpResults(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/serp_competitors/live",
        method: "post",
        ...args,
      });
    },
    getKeywordIdeasLive(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/keyword_ideas/live",
        method: "post",
        ...args,
      });
    },
    getDomainWhoisOverview(args = {}) {
      return this._makeRequest({
        path: "/domain_analytics/whois/overview/live",
        method: "post",
        ...args,
      });
    },
    getTechnologiesDomainList(args = {}) {
      return this._makeRequest({
        path: "/domain_analytics/technologies/domain_technologies/live",
        method: "post",
        ...args,
      });
    },
    getAppIntersection(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/app_intersection/live",
        method: "post",
        ...args,
      });
    },
    getBulkTrafficAnalytics(args = {}) {
      return this._makeRequest({
        path: "/dataforseo_labs/google/bulk_traffic_estimation/live",
        method: "post",
        ...args,
      });
    },
    getGoogleMyBusinessInfo(args = {}) {
      return this._makeRequest({
        path: "/business_data/google/my_business_info/live",
        method: "post",
        ...args,
      });
    },
    getTrustpilotReviews(args = {}) {
      return this._makeRequest({
        path: "/business_data/trustpilot/reviews/task_post",
        method: "post",
        ...args,
      });
    },
    getTripadvisorReviews(args = {}) {
      return this._makeRequest({
        path: "/business_data/tripadvisor/reviews/task_post",
        method: "post",
        ...args,
      });
    },
    getGoogleReviews(args = {}) {
      return this._makeRequest({
        path: "/business_data/google/reviews/task_post",
        method: "post",
        ...args,
      });
    },
    getBusinessListingsCategories(args = {}) {
      return this._makeRequest({
        path: "/business_data/business_listings/categories",
        ...args,
      });
    },
    getAppStoreSearch(args = {}) {
      return this._makeRequest({
        path: "/app_data/apple/app_searches/task_post",
        method: "post",
        ...args,
      });
    },
    getGooglePlaySearch(args = {}) {
      return this._makeRequest({
        path: "/app_data/google/app_searches/task_post",
        method: "post",
        ...args,
      });
    },
    getAppReviewsSummary(args = {}) {
      return this._makeRequest({
        path: "/app_data/apple/app_reviews/task_post",
        method: "post",
        ...args,
      });
    },
    getContentCitations(args = {}) {
      return this._makeRequest({
        path: "/content_analysis/search/live",
        method: "post",
        ...args,
      });
    },
    getSentimentAnalysis(args = {}) {
      return this._makeRequest({
        path: "/content_analysis/sentiment_analysis/live",
        method: "post",
        ...args,
      });
    },
    getContentSummary(args = {}) {
      return this._makeRequest({
        path: "/content_analysis/summary/live",
        method: "post",
        ...args,
      });
    },
  },
};
