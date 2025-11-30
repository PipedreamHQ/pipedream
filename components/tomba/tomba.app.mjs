import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tomba",
  propDefinitions: {
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain name to search (e.g., stripe.com)",
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to verify or search",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the person",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the person",
    },
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "The LinkedIn profile URL",
    },
    blogUrl: {
      type: "string",
      label: "Blog Post URL",
      description: "The blog post URL to find author email",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to validate",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter country code (e.g., US, UK, FR)",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Number of results to return (max 100)",
      optional: true,
      default: 10,
      min: 1,
      max: 100,
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "Natural language query or structured search terms",
    },
    filters: {
      type: "object",
      label: "Search Filters",
      description: "Structured filters for company search",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination",
      optional: true,
      default: 1,
      min: 1,
    },
    limitDomainSearch: {
      type: "string",
      label: "Limit",
      description: "Specifies the max number of email addresses to return.",
      optional: true,
      default: "10",
      options: [
        "10",
        "20",
        "50",
      ],
    },
    department: {
      type: "string",
      label: "Department",
      description:
        "Get only email addresses for people working in the selected department(s).",
      optional: true,
      options: [
        "engineering",
        "sales",
        "finance",
        "hr",
        "it",
        "marketing",
        "operations",
        "management",
        "executive",
        "legal",
        "support",
        "communication",
        "software",
        "security",
        "pr",
        "warehouse",
        "diversity",
        "administrative",
        "facilities",
        "accounting",
      ],
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL to analyze or search",
    },
    searchType: {
      type: "string",
      label: "Search Type",
      description: "Choose the type of search to perform",
      options: [
        {
          label: "Search by Domain",
          value: "domain",
        },
        {
          label: "Search by Email",
          value: "email",
        },
        {
          label: "Search by LinkedIn URL",
          value: "linkedin",
        },
      ],
      reloadProps: true,
      default: "domain",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name to search for",
    },
  },
  methods: {
    /**
     * Get the base URL for Tomba API
     * @returns {string} The base URL for API requests
     */
    _baseUrl() {
      return "https://api.tomba.io/v1";
    },
    /**
     * Get headers for API requests including authentication
     * @returns {object} Headers object with API credentials
     */
    _headers() {
      return {
        "X-Tomba-Key": this.$auth.api_key,
        "X-Tomba-Secret": this.$auth.api_secret,
        "User-Agent": "Pipedream/1.0",
        "Accept": "application/json",
      };
    },
    /**
     * Make an HTTP request to the Tomba API
     * @param {object} opts - Configuration options for the request
     * @param {object} opts.$ - Pipedream step context
     * @param {string} opts.path - API endpoint path
     * @param {string} [opts.method=GET] - HTTP method
     * @param {object} [opts.params] - Query parameters
     * @param {object} [opts.data] - Request body data
     * @returns {Promise} API response
     */
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    /**
     * Find author email from blog post URL
     * @param {object} opts - Configuration options
     * @param {object} opts.$ - Pipedream step context
     * @param {string} opts.blogUrl - The blog post URL to analyze
     * @returns {Promise} Author information and email address
     */
    async findAuthor({
      $, blogUrl, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/author-finder",
        params: {
          url: blogUrl,
          ...opts,
        },
      });
    },
    /**
     * Get every email address found on the internet for a domain
     * @param {string} opts.domain - The domain to search
     * @param {number} [opts.limit=10] - Number of results to return
     * @returns {Promise} Array of email addresses with sources
     */
    async searchDomain({
      $, domain, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/domain-search",
        params: {
          domain,
          ...opts,
        },
      });
    },
    /**
     * Get the status of a domain (e.g., if it's disposable or webmail)
     * @param {string} opts.domain - The domain to check
     * @returns {Promise} Domain status information
     * @description This endpoint checks if a domain is disposable or webmail.
     */
    async getDomainStatus({
      $, domain, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/domain-status",
        params: {
          domain,
          ...opts,
        },
      });
    },
    /**
     * Get the number of email addresses found for a domain
     * @param {string} opts.domain - The domain to check
     * @returns {Promise} Email count information
     * @description This endpoint retrieves the number of email addresses.
     */
    async getEmailCount({
      $, domain, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/email-count",
        params: {
          domain,
          ...opts,
        },
      });
    },
    /**
     * Enrich email data with additional information
     * @param {string} opts.email - The email address to enrich
     * @returns {Promise} Enriched email information
     * @description This endpoint enriches email data with additional information.
     */
    async enrichEmail({
      $, email, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/enrich",
        params: {
          email,
          ...opts,
        },
      });
    },
    /**
     * Find the most likely email address from a domain name, first name, and last name
     * @param {string} opts.domain - The domain name to use
     * @param {string} opts.firstName - The first name of the person
     * @param {string} opts.lastName - The last name of the person
     * @returns {Promise} Email address information
     * @description This endpoint generates or retrieves the most likely email address.
     */
    async findEmail({
      $, domain, firstName, lastName, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/email-finder",
        params: {
          domain,
          first_name: firstName,
          last_name: lastName,
          ...opts,
        },
      });
    },
    /**
     * Get the email format for a domain
     * @param {string} opts.domain - The domain to check
     * @returns {Promise} Email format information
     * @description This endpoint retrieves the email format used by a specific domain.
     */
    async getEmailFormat({
      $, domain, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/email-format",
        params: {
          domain,
          ...opts,
        },
      });
    },
    /**
     * Get the email sources for a specific email address
     * @param {string} opts.email - The email address to check
     * @returns {Promise} Email sources information
     * @description This endpoint retrieves the sources where a specific email address was found.
     */
    async getEmailSources({
      $, email, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/email-sources",
        params: {
          email,
          ...opts,
        },
      });
    },
    /**
     * Verify the validity of an email address
     * @param {string} opts.email - The email address to verify
     * @returns {Promise} Email verification information
     * @description This endpoint verifies the validity of an email address.
     */
    async verifyEmail({
      $, email, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/email-verifier",
        params: {
          email,
          ...opts,
        },
      });
    },
    /**
     * Find a LinkedIn profile based on a LinkedIn URL
     * @param {string} opts.linkedinUrl - The LinkedIn profile URL
     * @returns {Promise} LinkedIn profile information
     * @description This endpoint retrieves information from a LinkedIn profile URL.
     */
    async findLinkedIn({
      $, linkedinUrl, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/linkedin",
        params: {
          url: linkedinUrl,
          ...opts,
        },
      });
    },
    /**
     * Get the location information for a specific domain
     * @param {string} opts.domain - The domain to check
     * @returns {Promise} Location information
     * @description This endpoint retrieves location information associated with a specific domain.
     */
    async getLocation({
      $, domain, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/location",
        params: {
          domain,
          ...opts,
        },
      });
    },
    /**
     * Find a phone number based on various parameters
     * @param {string} [opts.domain] - The domain associated with the phone number
     * @param {string} [opts.email] - The email address associated with the phone number
     * @param {string} [opts.linkedinUrl] - The LinkedIn profile URL
     * @returns {Promise} Phone number information
     * @description This endpoint retrieves phone number information based on provided parameters.
     */
    async findPhone({
      $, domain, email, linkedinUrl, ...opts
    }) {
      const params = {};
      if (domain) params.domain = domain;
      if (email) params.email = email;
      if (linkedinUrl) params.linkedin = linkedinUrl;

      return this._makeRequest({
        $,
        path: "/phone-finder",
        params: {
          ...params,
          ...opts,
        },
      });
    },
    /**
     * Validate a phone number
     * @param {string} [opts.phoneNumber] - The phone number to validate
     * @param {string} [opts.country] - The country code (e.g., US, UK)
     * @returns {Promise} Phone validation information
     * @description This endpoint validates a phone number.
     */
    async validatePhone({
      $, phoneNumber, country, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/phone-validator",
        params: {
          phone: phoneNumber,
          country,
          ...opts,
        },
      });
    },
    /**
     * Find similar domains based on a specific domain
     * @param {string} opts.domain - The domain to check
     * @returns {Promise} Similar domain information
     * @description This endpoint retrieves domains similar to a specified domain.
     */
    async findSimilarDomains({
      $, domain, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/similar",
        params: {
          domain,
          ...opts,
        },
      });
    },
    /**
     * Get technology stack information for a specific domain
     * @param {string} opts.domain - The domain to check
     * @returns {Promise} Technology stack information
     * @description This endpoint retrieves technology stack information.
     */
    async getTechnology({
      $, domain, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/technology",
        params: {
          domain,
          ...opts,
        },
      });
    },
    /**
     * Get the account information for the authenticated user
     * @returns {Promise} Account information
     * @description This endpoint retrieves the account information for the authenticated user.
     */
    async getAccount({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/me",
        ...opts,
      });
    },
    /**
     * Search for companies based on various parameters
     * @param {*} param0
     * @returns {Promise} Company search results
     * @description This endpoint searches for companies based on various parameters.
     */
    async searchCompanies({
      $, query, filters, limit, page, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/reveal/search",
        method: "POST",
        data: {
          query,
          filters,
          limit,
          page,
          ...opts,
        },
      });
    },
    /**
     * Get domain suggestions based on a specific query
     * @param {string} opts.query - The query to search for domain suggestions
     * @returns {Promise} Domain suggestions
     * @description This endpoint retrieves domain suggestions based on a specific query.
     */
    async getDomainSuggestions({
      $, query, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/domain-suggestions",
        params: {
          query,
          ...opts,
        },
      });
    },
    /**
     * Get usage statistics for the authenticated user
     * @returns {Promise} Usage statistics
     * @description This endpoint retrieves usage statistics for the authenticated user.
     */
    async getUsage({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/usage",
        params: {
          ...opts,
        },
      });
    },
    /**
     * Get logs for the authenticated user
     * @param {string} opts.limit - The maximum number of logs to retrieve
     * @param {string} opts.page - The page number for pagination
     * @returns {Promise} Logs information
     * @description This endpoint retrieves logs for the authenticated user.
     */
    async getLogs({
      $, limit, page, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "/logs",
        params: {
          limit,
          page,
          ...opts,
        },
      });
    },
  },
};
