import { axios } from "@pipedream/platform";
import {
  API_BASE_URL,
  COMPANY_EXPANSIONS,
  PERSON_EXPANSIONS,
} from "./common/constants.mjs";
import {
  companyId as validateCompanyId,
  countryCode as validateCountryCode,
  parseResponse,
  personId as validatePersonId,
  safeAccount,
  serializeParams,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "companyenrich",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Company Domain",
      description: "The company domain, e.g. `stripe.com`. Use **Search Companies** to find a company's `domain`. Maximum 1,024 characters.",
    },
    companyId: {
      type: "string",
      label: "Company ID",
      description: "The CompanyEnrich UUID, e.g. `123e4567-e89b-12d3-a456-426614174000`. Use **Search Companies** or **Enrich Company** to find the company's `id` for **Get Company**.",
    },
    personId: {
      type: "string",
      label: "Person ID",
      description: "The person's ID as a decimal string, e.g. `1234567890123456789`. Use **Search People** to find the person's `id` for **Get Person**. Keep it as text to preserve 64-bit precision.",
    },
    companyExpand: {
      type: "string[]",
      label: "Company Expansions",
      description: "Additional company data, e.g. `[\"financial\", \"technologies\"]`. Each selected expansion adds 1 credit per returned company except `workforce`, which adds 5. Use **Get Company Workforce** with the expansion's `nextCursor` for earlier history.",
      options: COMPANY_EXPANSIONS,
      optional: true,
    },
    personExpand: {
      type: "string[]",
      label: "Person Expansions",
      description: "Additional person data, e.g. `[\"education\"]`. Education adds 1 credit per returned person to the base operation cost.",
      options: PERSON_EXPANSIONS,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Maximum results for this single page, e.g. `10`. Accepts 1 to 100; defaults to 10. Paid searches charge per returned record, and empty searches can still consume credits.",
      default: 10,
      min: 1,
      max: 100,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Opaque continuation value, e.g. `eyJvZmZzZXQiOjEwfQ`. Copy `nextCursor` from **Search Companies** or **Search People**, keeping the same query and action. Omit for the first page. Cursors expire after 30 minutes; maximum 1,024 characters.",
      optional: true,
    },
    companyFilter: {
      type: "string",
      label: "Company Filter",
      description: "Company filters as a JSON object, e.g. `{\"country\":[\"US\"],\"categories\":\"saas\"}`. Use **List Industries** for `naicsCodes`, **Lookup Technologies** for technology names, and **Search Countries** for country codes. This is the nested filter, without pagination or expansions.",
      optional: true,
    },
    personFilter: {
      type: "string",
      label: "Person Filter",
      description: "Person filters as a JSON object, e.g. `{\"domain\":[\"stripe.com\"],\"position\":\"engineer\"}`. Use **Lookup Positions** for job titles and **Search Countries** for country codes. This is the nested filter, without pagination or expansions.",
      optional: true,
    },
    semantic: {
      type: "string",
      label: "Semantic Query",
      description: "A JSON object, e.g. `{\"query\":\"customer support software\",\"autoFilter\":true}`. Query is required and at most 500 characters; optional `weight` is 0 to 1. Attribute inference defaults to true. Cannot combine with Lookalike Query.",
      optional: true,
    },
    lookalike: {
      type: "string",
      label: "Lookalike Query",
      description: "A JSON object, e.g. `{\"domains\":[\"stripe.com\"],\"weight\":0.7}`. Supply 1 to 10 seed domains, optional `weight` from -1 to 1 and `minScore` from 0 to 1. Use **Search Companies** to find seed domains. Cannot combine with Semantic Query.",
      optional: true,
    },
    companyQuery: {
      type: "string",
      label: "Employer Company Query",
      description: "Company criteria for people search as a JSON object, e.g. `{\"filter\":{\"country\":\"US\",\"categories\":\"saas\"}}`. Accepts `filter`, `semantic`, or `lookalike` as in **Search Companies**. Semantic and lookalike modes cannot be combined.",
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The text to search for, e.g. `software`. Maximum 100 characters. Empty autocomplete queries return no suggestions; geographic searches can omit the query.",
      optional: true,
    },
    countryCodes: {
      type: "string[]",
      label: "Country Codes",
      description: "Two-letter country codes, e.g. `[\"US\", \"GB\"]`. Use **Search Countries** to find the `code` values. Supply at most 250 codes.",
      optional: true,
    },
    waitForEnrichment: {
      type: "boolean",
      label: "Wait for Enrichment",
      description: "Whether to wait for companies not yet stored, e.g. `true`. Defaults to true. With false, eligible misses schedule background enrichment; batch items may return `pending`, while domain enrichment may return 404.",
      default: true,
      optional: true,
    },
  },
  methods: {
    _makeRequest({
      $, method, path, params, data,
    }) {
      return axios($ ?? this, {
        baseURL: API_BASE_URL,
        url: path,
        method,
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
          Accept: "application/json",
        },
        params,
        data,
        transformResponse: [
          parseResponse,
        ],
        paramsSerializer: serializeParams,
        maxRedirects: 0,
        timeout: 60000,
      });
    },
    enrichCompany({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        params,
        method: "GET",
        path: "/companies/enrich",
      });
    },
    getCompany({
      $, companyId, params,
    } = {}) {
      return this._makeRequest({
        $,
        params,
        method: "GET",
        path: `/companies/${validateCompanyId(companyId)}`,
      });
    },
    enrichCompanyByProperties({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/companies/enrich",
      });
    },
    enrichCompanies({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/companies/enrich/batch",
      });
    },
    searchCompanies({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/companies/search",
      });
    },
    countCompanies({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/companies/search/count",
      });
    },
    previewCompanies({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/companies/search/preview",
      });
    },
    getCompanyWorkforce({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        params,
        method: "GET",
        path: "/companies/workforce",
      });
    },
    autocompleteCompanies({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        params,
        method: "GET",
        path: "/companies/autocomplete",
      });
    },
    searchPeople({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/people/search",
      });
    },
    countPeople({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/people/search/count",
      });
    },
    previewPeople({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/people/search/preview",
      });
    },
    getPerson({
      $, personId, params,
    } = {}) {
      return this._makeRequest({
        $,
        params,
        method: "GET",
        path: `/people/${validatePersonId(personId)}`,
      });
    },
    enrichPerson({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/people/enrich",
      });
    },
    findWorkEmail({
      $, personId, params,
    } = {}) {
      return this._makeRequest({
        $,
        params,
        method: "GET",
        path: `/people/${validatePersonId(personId)}/email`,
      });
    },
    getRegions({ $ } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/geo/regions",
      });
    },
    getCountry({
      $, countryCode,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/geo/countries/${validateCountryCode(countryCode)}`,
      });
    },
    searchCountries({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/geo/countries",
      });
    },
    searchStates({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/geo/states",
      });
    },
    searchCities({
      $, data,
    } = {}) {
      return this._makeRequest({
        $,
        data,
        method: "POST",
        path: "/geo/cities",
      });
    },
    listIndustries({ $ } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/industries",
      });
    },
    lookupKeywords({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        params,
        method: "GET",
        path: "/keywords/autocomplete",
      });
    },
    lookupTechnologies({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        params,
        method: "GET",
        path: "/technologies/autocomplete",
      });
    },
    lookupPositions({
      $, params,
    } = {}) {
      return this._makeRequest({
        $,
        params,
        method: "GET",
        path: "/positions/autocomplete",
      });
    },
    async getAccount({ $ } = {}) {
      const response = await this._makeRequest({
        $,
        method: "GET",
        path: "/me",
      });
      return safeAccount(response);
    },
  },
};
