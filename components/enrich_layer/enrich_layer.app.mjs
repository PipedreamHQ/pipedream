import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "enrich_layer",
  propDefinitions: {
    profileUrl: {
      type: "string",
      label: "Profile URL",
      description: "The professional network profile URL of the person (e.g., `https://linkedin.com/in/johnrmarty/`). Provide only one of: Profile URL, Twitter/X URL, or Facebook URL.",
      optional: true,
    },
    twitterProfileUrl: {
      type: "string",
      label: "Twitter/X Profile URL",
      description: "The Twitter/X profile URL (e.g., `https://x.com/johnrmarty/`). Provide only one of: Profile URL, Twitter/X URL, or Facebook URL.",
      optional: true,
    },
    facebookProfileUrl: {
      type: "string",
      label: "Facebook Profile URL",
      description: "The Facebook profile URL (e.g., `https://facebook.com/johnrmarty/`). Provide only one of: Profile URL, Twitter/X URL, or Facebook URL.",
      optional: true,
    },
    companyProfileUrl: {
      type: "string",
      label: "Company Profile URL",
      description: "The professional network URL of the company (e.g., `https://www.linkedin.com/company/google/`).",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company.",
    },
    companyDomain: {
      type: "string",
      label: "Company Domain",
      description: "The company website or domain name (e.g., `accenture.com`).",
    },
    useCache: {
      type: "string",
      label: "Cache Strategy",
      description: "`if-present` returns cached data regardless of age. `if-recent` returns fresh data (max 29 days old) for 1 extra credit.",
      optional: true,
      options: [
        {
          label: "If Present",
          value: "if-present",
        },
        {
          label: "If Recent (+1 credit)",
          value: "if-recent",
        },
      ],
    },
    fallbackToCache: {
      type: "string",
      label: "Fallback to Cache",
      description: "Tweaks the fallback behavior if an error arises from fetching a fresh profile.",
      optional: true,
      options: [
        {
          label: "On Error (default)",
          value: "on-error",
        },
        {
          label: "Never",
          value: "never",
        },
      ],
    },
    liveFetch: {
      type: "string",
      label: "Live Fetch",
      description: "Force the API to fetch a fresh profile. `force` costs an extra 9 credits.",
      optional: true,
      options: [
        {
          label: "Default",
          value: "default",
        },
        {
          label: "Force (+9 credits)",
          value: "force",
        },
      ],
    },
    includeExclude: {
      type: "string",
      label: "Include/Exclude",
      description: "Whether to include or exclude this optional data.",
      optional: true,
      options: [
        {
          label: "Exclude (default)",
          value: "exclude",
        },
        {
          label: "Include (+1 credit)",
          value: "include",
        },
      ],
    },
    enrichProfiles: {
      type: "string",
      label: "Enrich Profiles",
      description: "Get the full profile data instead of only profile URLs. `enrich` adds 1 credit per result.",
      optional: true,
      options: [
        {
          label: "Skip (default)",
          value: "skip",
        },
        {
          label: "Enrich (+1 credit/result)",
          value: "enrich",
        },
      ],
    },
    enrichProfile: {
      type: "string",
      label: "Enrich Profile",
      description: "Enrich the result with cached profile data. Adds 1 credit if set to `enrich`.",
      optional: true,
      options: [
        {
          label: "Skip (default)",
          value: "skip",
        },
        {
          label: "Enrich (+1 credit)",
          value: "enrich",
        },
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Maximum number of results returned per API call. Defaults to 10.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Filter results by country using Alpha-2 ISO 3166 country code (e.g., `US`, `SG`).",
      optional: true,
    },
    employmentStatus: {
      type: "string",
      label: "Employment Status",
      description: "Filter by employment status.",
      optional: true,
      options: [
        {
          label: "Current (default)",
          value: "current",
        },
        {
          label: "Past",
          value: "past",
        },
        {
          label: "All",
          value: "all",
        },
      ],
    },
  },
  methods: {
    /**
     * Returns the full API URL for a given path.
     * @param {string} path - The API endpoint path (e.g., "/api/v2/company").
     * @returns {string} The full URL.
     */
    getUrl(path) {
      return `https://enrichlayer.com${path}`;
    },
    /**
     * Returns the default headers for API requests, including the Bearer token.
     * @returns {object} Headers object with Authorization.
     */
    getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    /**
     * Makes an authenticated HTTP request to the Enrich Layer API.
     * @param {object} opts - Request options.
     * @param {object} [opts.$] - The Pipedream step context for `$.export` and `$.summary`.
     * @param {string} opts.path - The API endpoint path.
     * @param {object} [opts.params] - Query parameters.
     * @param {object} [opts.headers] - Additional headers (merged with defaults).
     * @returns {Promise<object>} The API response data.
     */
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: {
          ...this.getHeaders(),
          ...headers,
        },
      });
    },
    checkDisposableEmail(args = {}) {
      return this._makeRequest({
        path: "/api/v2/disposable-email",
        ...args,
      });
    },
    getCompanyIdLookup(args = {}) {
      return this._makeRequest({
        path: "/api/v2/company/resolve-id",
        ...args,
      });
    },
    getCompanyLookup(args = {}) {
      return this._makeRequest({
        path: "/api/v2/company/resolve",
        ...args,
      });
    },
    getCompanyProfile(args = {}) {
      return this._makeRequest({
        path: "/api/v2/company",
        ...args,
      });
    },
    getCompanyProfilePicture(args = {}) {
      return this._makeRequest({
        path: "/api/v2/company/profile-picture",
        ...args,
      });
    },
    getCreditBalance(args = {}) {
      return this._makeRequest({
        path: "/api/v2/credit-balance",
        ...args,
      });
    },
    getEmployeeCount(args = {}) {
      return this._makeRequest({
        path: "/api/v2/company/employees/count",
        ...args,
      });
    },
    getEmployeeListing(args = {}) {
      return this._makeRequest({
        path: "/api/v2/company/employees/",
        ...args,
      });
    },
    getEmployeeSearch(args = {}) {
      return this._makeRequest({
        path: "/api/v2/company/employee/search/",
        ...args,
      });
    },
    getJobListingCount(args = {}) {
      return this._makeRequest({
        path: "/api/v2/company/job/count",
        ...args,
      });
    },
    getJobProfile(args = {}) {
      return this._makeRequest({
        path: "/api/v2/job",
        ...args,
      });
    },
    getJobSearch(args = {}) {
      return this._makeRequest({
        path: "/api/v2/company/job",
        ...args,
      });
    },
    getPersonLookup(args = {}) {
      return this._makeRequest({
        path: "/api/v2/profile/resolve",
        ...args,
      });
    },
    getPersonProfile(args = {}) {
      return this._makeRequest({
        path: "/api/v2/profile",
        ...args,
      });
    },
    getPersonProfilePicture(args = {}) {
      return this._makeRequest({
        path: "/api/v2/person/profile-picture",
        ...args,
      });
    },
    getPersonalContactNumber(args = {}) {
      return this._makeRequest({
        path: "/api/v2/contact-api/personal-contact",
        ...args,
      });
    },
    getPersonalEmail(args = {}) {
      return this._makeRequest({
        path: "/api/v2/contact-api/personal-email",
        ...args,
      });
    },
    getReverseContactNumberLookup(args = {}) {
      return this._makeRequest({
        path: "/api/v2/resolve/phone",
        ...args,
      });
    },
    getReverseEmailLookup(args = {}) {
      return this._makeRequest({
        path: "/api/v2/profile/resolve/email",
        ...args,
      });
    },
    getRoleLookup(args = {}) {
      return this._makeRequest({
        path: "/api/v2/find/company/role/",
        ...args,
      });
    },
    getSchoolProfile(args = {}) {
      return this._makeRequest({
        path: "/api/v2/school",
        ...args,
      });
    },
    getStudentListing(args = {}) {
      return this._makeRequest({
        path: "/api/v2/school/students/",
        ...args,
      });
    },
    getWorkEmailLookup(args = {}) {
      return this._makeRequest({
        path: "/api/v2/profile/email",
        ...args,
      });
    },
    searchCompanies(args = {}) {
      return this._makeRequest({
        path: "/api/v2/search/company",
        ...args,
      });
    },
    searchPeople(args = {}) {
      return this._makeRequest({
        path: "/api/v2/search/person",
        ...args,
      });
    },
  },
};
