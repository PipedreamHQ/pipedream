import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import {
  API_BASE_URL,
  COMPANY_EXPANSIONS,
  PERSON_EXPANSIONS,
} from "./common/constants.mjs";
import {
  companyId as validateCompanyId,
  countryCode as validateCountryCode,
  integerValue,
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
      description: "Maximum results per page, e.g. `10`. Accepts 1 to 100; defaults to 10. Paid searches charge per returned record, and empty searches can still consume credits.",
      default: 10,
      min: 1,
      max: 100,
      optional: true,
    },
    maxPages: {
      type: "integer",
      label: "Maximum Pages",
      description: "Maximum pages to fetch, e.g. `3`. Accepts 1 to 100; defaults to 1. More pages can consume more credits. With 1, returns the original page response. With more than 1, returns `{ pages, nextCursor }`, retaining each complete page in order. Stops when no cursor remains or its 20-second local budget is reached. On that deadline it returns completed pages with `partial: true` and `stoppedReason: time_budget`; allow sufficient workflow runtime.",
      default: 1,
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
      description: "Company filters as a JSON object, e.g. `{\"country\":[\"US\"],\"categories\":\"saas\"}`. Use **List Industries** for `naicsCodes`, **Lookup Technologies** for technology names, and **Search Countries** for country codes. This is the nested filter, without pagination or expansions. [See the input schema](https://docs.companyenrich.com/reference/post_v2-companies-search).",
      optional: true,
    },
    personFilter: {
      type: "string",
      label: "Person Filter",
      description: "Person filters as a JSON object, e.g. `{\"domain\":[\"stripe.com\"],\"position\":\"engineer\"}`. Use **Lookup Positions** for job titles and **Search Countries** for country codes. This is the nested filter, without pagination or expansions. [See the input schema](https://docs.companyenrich.com/reference/post_v2-people-search).",
      optional: true,
    },
    semantic: {
      type: "string",
      label: "Semantic Query",
      description: "A JSON object, e.g. `{\"query\":\"customer support software\",\"autoFilter\":true}`. Query is required and at most 500 characters; optional `weight` is 0 to 1. Attribute inference defaults to true. Cannot combine with Lookalike Query. [See the input schema](https://docs.companyenrich.com/reference/post_v2-companies-search).",
      optional: true,
    },
    lookalike: {
      type: "string",
      label: "Lookalike Query",
      description: "A JSON object, e.g. `{\"domains\":[\"stripe.com\"],\"weight\":0.7}`. Supply 1 to 10 seed domains, optional `weight` from -1 to 1 and `minScore` from 0 to 1. Use **Search Companies** to find seed domains. Cannot combine with Semantic Query. [See the input schema](https://docs.companyenrich.com/reference/post_v2-companies-search).",
      optional: true,
    },
    companyQuery: {
      type: "string",
      label: "Employer Company Query",
      description: "Company criteria for people search as a JSON object, e.g. `{\"filter\":{\"country\":\"US\",\"categories\":\"saas\"}}`. Accepts `filter`, `semantic`, or `lookalike` as in **Search Companies**. Company queries using `query`, keyword, technology, funding, workforce, `reportedEmployees`, or required-feature filters, or semantic or lookalike queries, match people at only the 1,000 best-matching companies. Semantic and lookalike modes cannot be combined. [See the input schema](https://docs.companyenrich.com/reference/post_v2-people-search).",
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
    /**
     * Yield complete cursor pages lazily, bounded by the requested page limit.
     * The next request is made only when the caller advances the generator.
     * @param {Object} options - Pagination configuration.
     * @param {Object} [options.$] - Pipedream execution context.
     * @param {string} options.method - Supported search or workforce app method.
     * @param {Object} [options.data] - POST filters, page size, expansions and starting cursor.
     * @param {Object} [options.params] - Workforce company lookup and starting cursor.
     * @param {number} [options.maxPages=1] - Maximum pages to request, from 1 to 100.
     * @param {number} [options.deadline=Infinity] - Absolute local deadline in milliseconds.
     * @param {AbortSignal} [options.signal] - Cancellation signal for in-flight requests.
     * @yields {Object} One complete API response, preserving metadata and record order.
     * @returns {AsyncGenerator<Object>} A bounded sequence of response pages.
     */
    async *_paginate({
      $, method, data, params, maxPages = 1, deadline = Infinity, signal,
    } = {}) {
      const limit = integerValue(maxPages, "Maximum Pages", 1, 100, 1);
      const methods = [
        "searchCompanies",
        "searchPeople",
        "searchCountries",
        "searchStates",
        "searchCities",
        "getCompanyWorkforce",
      ];
      if (!methods.includes(method)) {
        throw new ConfigurationError("Pagination requires a supported search or workforce method.");
      }
      const field = method === "getCompanyWorkforce"
        ? "params"
        : "data";
      const original = field === "params"
        ? params
        : data;
      let cursor = original?.cursor;
      const seen = new Set();
      for (let page = 0; page < limit; page++) {
        const remaining = deadline - Date.now();
        if (remaining <= 0 || signal?.aborted) {
          return;
        }
        if (cursor) {
          if (typeof cursor !== "string" || seen.has(cursor)) {
            throw new Error("The API returned an invalid or repeated pagination cursor; no further pages were requested.");
          }
          seen.add(cursor);
        }
        const response = await this[method]({
          $,
          signal,
          timeout: Number.isFinite(remaining)
            ? Math.min(60000, remaining)
            : undefined,
          [field]: {
            ...original,
            cursor,
          },
        });
        yield response;
        cursor = response.nextCursor;
        if (!cursor) {
          return;
        }
      }
    },
    /**
     * Collect a bounded page sequence without discarding per-page metadata.
     * Single-page mode preserves the original API response shape. Multi-page mode
     * exports completed-page snapshots and cancels requests after a 20-second budget.
     * A local deadline returns explicit partial results; other request errors still throw.
     * Named exports are not a guarantee of persistence after platform termination.
     * @param {Object} options - Options accepted by _paginate.
     * @param {Object} [options.$] - Pipedream execution context.
     * @param {string} options.method - Supported search or workforce app method.
     * @param {Object} [options.data] - POST filters, page size, expansions and starting cursor.
     * @param {Object} [options.params] - Workforce company lookup and starting cursor.
     * @param {number} [options.maxPages=1] - Maximum pages to request, from 1 to 100.
     * @returns {Promise<Object>} Original page for limit 1; otherwise pages and cursor,
     *   with partial and stoppedReason fields if the local time budget is reached.
     */
    async collectPages(options = {}) {
      const limit = integerValue(options.maxPages, "Maximum Pages", 1, 100, 1);
      if (limit === 1) {
        for await (const page of this._paginate({
          ...options,
          maxPages: limit,
        })) {
          return page;
        }
      }
      const pages = [];
      const budgetMs = 20000;
      const deadline = Date.now() + budgetMs;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), budgetMs);
      let stoppedForTime = false;
      try {
        for await (const page of this._paginate({
          ...options,
          maxPages: limit,
          deadline,
          signal: controller.signal,
        })) {
          pages.push(page);
          if (typeof options.$?.export === "function") {
            options.$.export("paginationProgress", {
              pages: [
                ...pages,
              ],
              nextCursor: page.nextCursor,
              completedPages: pages.length,
            });
          }
        }
        stoppedForTime = Boolean(pages[pages.length - 1]?.nextCursor)
          && pages.length < limit
          && (controller.signal.aborted || Date.now() >= deadline);
      } catch (error) {
        const timedOut = [
          "ECONNABORTED",
          "ETIMEDOUT",
          "ERR_CANCELED",
        ].includes(error.code);
        const deadlineReached = controller.signal.aborted || Date.now() >= deadline;
        if (!pages.length || !timedOut || !deadlineReached || error.response?.status) {
          throw error;
        }
        stoppedForTime = true;
      } finally {
        clearTimeout(timer);
      }
      if (!pages.length) {
        throw new Error("Pagination time budget expired before a page completed.");
      }
      return {
        pages,
        nextCursor: pages[pages.length - 1].nextCursor,
        ...(stoppedForTime && {
          partial: true,
          stoppedReason: "time_budget",
        }),
      };
    },

    /**
     * Send one authenticated request to the fixed CompanyEnrich API v2 base URL.
     *
     * @param {object} options - Request configuration.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {string} options.method - HTTP method for the endpoint.
     * @param {string} options.path - Endpoint path relative to the API v2 base URL.
     * @param {object} [options.params] - Query parameters; arrays use repeated keys.
     * @param {object} [options.data] - JSON request body.
     * @param {number} [options.timeout=60000] - Request timeout in milliseconds.
     * @param {AbortSignal} [options.signal] - Optional absolute-deadline cancellation.
     * @returns {Promise<object>} Parsed API response, preserving large integers as strings.
     */
    _makeRequest({
      $, method, path, params, data, timeout = 60000, signal,
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
        timeout,
        signal,
      });
    },
    /**
     * Enrich one company from its domain, optionally waiting for on-demand enrichment.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.params - Enrichment query parameters.
     * @param {string} options.params.domain - Company domain to enrich.
     * @param {string[]} [options.params.expand] - Additional company data to request.
     * @param {boolean} [options.params.waitForEnrichment=true] - Whether the API waits for
     *   enrichment.
     * @returns {Promise<object>} Company profile and requested expansions.
     */
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
    /**
     * Retrieve one company using its CompanyEnrich UUID.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {string} options.companyId - CompanyEnrich company UUID.
     * @param {object} [options.params] - Profile query parameters.
     * @param {string[]} [options.params.expand] - Additional company data to request.
     * @returns {Promise<object>} Company profile and requested expansions.
     */
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
    /**
     * Resolve a company from its name or social profile identifiers.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.data - Company identifiers and optional expansions.
     * @param {string} [options.data.name] - Company name to match.
     * @param {string} [options.data.linkedinUrl] - Company LinkedIn profile URL.
     * @param {string} [options.data.linkedinId] - Company LinkedIn identifier.
     * @param {string} [options.data.twitterUrl] - Company Twitter or X profile URL.
     * @param {string} [options.data.facebookUrl] - Company Facebook profile URL.
     * @param {string} [options.data.instagramUrl] - Company Instagram profile URL.
     * @param {string} [options.data.youtubeUrl] - Company YouTube channel URL.
     * @param {string[]} [options.data.expand] - Additional company data to request.
     * @returns {Promise<object>} Best matching company profile and requested expansions.
     */
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
    /**
     * Enrich up to 50 company domains in one request, preserving per-domain outcomes.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.data - Batch enrichment body.
     * @param {string[]} options.data.domains - Between 1 and 50 company domains.
     * @param {string[]} [options.data.expand] - Additional company data to request.
     * @param {boolean} [options.data.waitForEnrichment=true] - Whether the API waits for
     *   enrichment.
     * @returns {Promise<object>} Batch result with found, not-found, invalid-domain or
     *   pending outcomes.
     */
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
    /**
     * Search one cursor page of companies without collecting additional pages.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.data - Search criteria body.
     * @param {object} [options.data.filter] - Structured company filters.
     * @param {object} [options.data.semantic] - Semantic query; cannot be combined with lookalike.
     * @param {object} [options.data.lookalike] - Lookalike seed query; cannot be combined
     *   with semantic.
     * @param {number} [options.data.pageSize] - Maximum records for this page, from 1 to 100.
     * @param {string} [options.data.cursor] - Continuation cursor for the same query.
     * @param {string[]} [options.data.expand] - Additional data for each returned record.
     * @param {number} [options.timeout=60000] - Request timeout in milliseconds.
     * @param {AbortSignal} [options.signal] - Optional pagination cancellation.
     * @returns {Promise<object>} Ordered companies results with pagination metadata.
     */
    searchCompanies({
      $, data, timeout, signal,
    } = {}) {
      return this._makeRequest({
        $,
        timeout,
        signal,
        data,
        method: "POST",
        path: "/companies/search",
      });
    },
    /**
     * Count matching companies without pagination or expansions.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.data - Search criteria body.
     * @param {object} [options.data.filter] - Structured company filters.
     * @param {object} [options.data.semantic] - Semantic query; cannot be combined with lookalike.
     * @param {object} [options.data.lookalike] - Lookalike seed query; cannot be combined
     *   with semantic.
     * @returns {Promise<object>} Accessible count and total before plan limits.
     */
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
    /**
     * Preview matching companies without pagination or expansions.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.data - Search criteria body.
     * @param {object} [options.data.filter] - Structured company filters.
     * @param {object} [options.data.semantic] - Semantic query; cannot be combined with lookalike.
     * @param {object} [options.data.lookalike] - Lookalike seed query; cannot be combined
     *   with semantic.
     * @returns {Promise<object>} Limited companies summaries available under the account
     *   capability.
     */
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
    /**
     * Retrieve one 12-month page of workforce history for exactly one company.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.params - Workforce query parameters.
     * @param {string} [options.params.id] - Company UUID; provide exactly one of id or domain.
     * @param {string} [options.params.domain] - Company domain; provide exactly one of id or
     *   domain.
     * @param {string} [options.params.cursor] - Continuation cursor for earlier history.
     * @param {number} [options.timeout=60000] - Request timeout in milliseconds.
     * @param {AbortSignal} [options.signal] - Optional pagination cancellation.
     * @returns {Promise<object>} Workforce history page with the continuation cursor when
     *   available.
     */
    getCompanyWorkforce({
      $, params, timeout, signal,
    } = {}) {
      return this._makeRequest({
        $,
        timeout,
        signal,
        params,
        method: "GET",
        path: "/companies/workforce",
      });
    },
    /**
     * Find up to 10 company suggestions matching a domain prefix or URL.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.params - Autocomplete query parameters.
     * @param {string} options.params.query - Domain prefix or URL; empty text returns no
     *   suggestions.
     * @returns {Promise<object>} Company suggestions in the items array.
     */
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
    /**
     * Search one cursor page of people without collecting additional pages.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.data - Search criteria body.
     * @param {object} [options.data.filter] - Structured person filters.
     * @param {object} [options.data.company] - Employer company filter, semantic or
     *   lookalike query.
     * @param {number} [options.data.pageSize] - Maximum records for this page, from 1 to 100.
     * @param {string} [options.data.cursor] - Continuation cursor for the same query.
     * @param {string[]} [options.data.expand] - Additional data for each returned record.
     * @param {number} [options.timeout=60000] - Request timeout in milliseconds.
     * @param {AbortSignal} [options.signal] - Optional pagination cancellation.
     * @returns {Promise<object>} Ordered people results with pagination metadata.
     */
    searchPeople({
      $, data, timeout, signal,
    } = {}) {
      return this._makeRequest({
        $,
        timeout,
        signal,
        data,
        method: "POST",
        path: "/people/search",
      });
    },
    /**
     * Count matching people without pagination or expansions.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.data - Search criteria body.
     * @param {object} [options.data.filter] - Structured person filters.
     * @param {object} [options.data.company] - Employer company filter, semantic or
     *   lookalike query.
     * @returns {Promise<object>} Accessible count and total before plan limits.
     */
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
    /**
     * Preview matching people without pagination or expansions.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.data - Search criteria body.
     * @param {object} [options.data.filter] - Structured person filters.
     * @param {object} [options.data.company] - Employer company filter, semantic or
     *   lookalike query.
     * @returns {Promise<object>} Limited people summaries available under the account capability.
     */
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
    /**
     * Retrieve a professional profile using an exact CompanyEnrich person ID.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {string} options.personId - Positive int64 person ID as decimal text.
     * @param {object} [options.params] - Profile query parameters.
     * @param {string[]} [options.params.expand] - Additional person data to request.
     * @returns {Promise<object>} Person profile and requested expansions.
     */
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
    /**
     * Resolve the best matching professional profile for a known work email.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.data - Email resolution body.
     * @param {string} options.data.email - Known work email address.
     * @param {string[]} [options.data.expand] - Additional person data to request.
     * @returns {Promise<object>} Best matching person profile and requested expansions.
     */
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
    /**
     * Request a work email lookup without automatically polling pending results.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {string} options.personId - Positive int64 person ID as decimal text.
     * @param {object} [options.params] - Email lookup query parameters.
     * @param {string} [options.params.domain] - A company domain from the person profile.
     * @returns {Promise<object>} Email lookup status and email only when found.
     */
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
    /**
     * Retrieve geographic regions and their country codes.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @returns {Promise<object>} Geographic region reference data.
     */
    getRegions({ $ } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/geo/regions",
      });
    },
    /**
     * Retrieve country metadata from a two-letter country code.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {string} options.countryCode - Two-letter country code, case-insensitive.
     * @returns {Promise<object>} Country metadata.
     */
    getCountry({
      $, countryCode,
    } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: `/geo/countries/${validateCountryCode(countryCode)}`,
      });
    },
    /**
     * Search one cursor page of countries by name and optional geographic filters.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} [options.data] - Geographic search body.
     * @param {string} [options.data.query] - Case-insensitive name substring.
     * @param {number} [options.data.pageSize] - Maximum records for this page, from 1 to 100.
     * @param {string} [options.data.cursor] - Continuation cursor for the same filters.
     * @param {number} [options.timeout=60000] - Request timeout in milliseconds.
     * @param {AbortSignal} [options.signal] - Optional pagination cancellation.
     * @returns {Promise<object>} Matching countries and pagination metadata.
     */
    searchCountries({
      $, data, timeout, signal,
    } = {}) {
      return this._makeRequest({
        $,
        timeout,
        signal,
        data,
        method: "POST",
        path: "/geo/countries",
      });
    },
    /**
     * Search one cursor page of states by name and optional geographic filters.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} [options.data] - Geographic search body.
     * @param {string} [options.data.query] - Case-insensitive name substring.
     * @param {number} [options.data.pageSize] - Maximum records for this page, from 1 to 100.
     * @param {string} [options.data.cursor] - Continuation cursor for the same filters.
     * @param {string[]} [options.data.countryCodes] - Two-letter country codes.
     * @param {number} [options.timeout=60000] - Request timeout in milliseconds.
     * @param {AbortSignal} [options.signal] - Optional pagination cancellation.
     * @returns {Promise<object>} Matching states and pagination metadata.
     */
    searchStates({
      $, data, timeout, signal,
    } = {}) {
      return this._makeRequest({
        $,
        timeout,
        signal,
        data,
        method: "POST",
        path: "/geo/states",
      });
    },
    /**
     * Search one cursor page of cities by name and optional geographic filters.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} [options.data] - Geographic search body.
     * @param {string} [options.data.query] - Case-insensitive name substring.
     * @param {number} [options.data.pageSize] - Maximum records for this page, from 1 to 100.
     * @param {string} [options.data.cursor] - Continuation cursor for the same filters.
     * @param {string[]} [options.data.countryCodes] - Two-letter country codes.
     * @param {number[]} [options.data.stateIds] - Positive state IDs from Search States.
     * @param {number} [options.timeout=60000] - Request timeout in milliseconds.
     * @param {AbortSignal} [options.signal] - Optional pagination cancellation.
     * @returns {Promise<object>} Matching cities and pagination metadata.
     */
    searchCities({
      $, data, timeout, signal,
    } = {}) {
      return this._makeRequest({
        $,
        timeout,
        signal,
        data,
        method: "POST",
        path: "/geo/cities",
      });
    },
    /**
     * Retrieve industries and their NAICS code prefixes.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @returns {Promise<object>} Industry reference data in the items array.
     */
    listIndustries({ $ } = {}) {
      return this._makeRequest({
        $,
        method: "GET",
        path: "/industries",
      });
    },
    /**
     * Find up to 10 keywords suggestions for search filters.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.params - Autocomplete query parameters.
     * @param {string} options.params.query - Search text; empty text returns no suggestions.
     * @returns {Promise<object>} Reference suggestions in the items array.
     */
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
    /**
     * Find up to 10 technologies suggestions for search filters.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.params - Autocomplete query parameters.
     * @param {string} options.params.query - Search text; empty text returns no suggestions.
     * @returns {Promise<object>} Reference suggestions in the items array.
     */
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
    /**
     * Find up to 10 positions suggestions for search filters.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @param {object} options.params - Autocomplete query parameters.
     * @param {string} options.params.query - Search text; empty text returns no suggestions.
     * @returns {Promise<object>} Reference suggestions in the items array.
     */
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
    /**
     * Retrieve account information while omitting credentials and unrecognized fields.
     *
     * @param {object} [options={}] - Endpoint request options.
     * @param {object} [options.$] - Pipedream execution context.
     * @returns {Promise<object>} Account ID, credit usage and documented capabilities only.
     */
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
