import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lusha",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Enrich Contacts Props
    enrichContactRequestId: {
      type: "string",
      label: "Enrich Contact Request ID",
      description: "The request ID generated from the contact search response.",
    },
    enrichContactIds: {
      type: "string[]",
      label: "Enrich Contact IDs",
      description: "Array of contact IDs to enrich.",
      min: 1,
      max: 100,
    },
    // Enrich Companies Props
    enrichCompanyRequestId: {
      type: "string",
      label: "Enrich Company Request ID",
      description: "The request ID generated from the company search response.",
    },
    enrichCompanyIds: {
      type: "string[]",
      label: "Enrich Company IDs",
      description: "Array of company IDs to enrich.",
      min: 1,
      max: 100,
    },
    // Search Contacts Props
    searchContactNames: {
      type: "string[]",
      label: "Contact Names",
      description: "Names of contacts to search.",
      optional: true,
    },
    searchContactJobTitles: {
      type: "string[]",
      label: "Contact Job Titles",
      description: "Job titles of contacts to search.",
      optional: true,
    },
    searchContactJobTitlesExactMatch: {
      type: "string[]",
      label: "Exact Match Contact Job Titles",
      description: "Exact job titles of contacts to search.",
      optional: true,
    },
    searchContactCountries: {
      type: "string[]",
      label: "Contact Countries",
      description: "Country codes of contacts to search.",
      optional: true,
      max: 2,
    },
    searchContactSeniority: {
      type: "integer[]",
      label: "Contact Seniority Levels",
      description: "Seniority levels of contacts to search.",
      optional: true,
    },
    searchContactDepartments: {
      type: "string[]",
      label: "Contact Departments",
      description: "Departments of contacts to search.",
      optional: true,
      max: 50,
    },
    searchContactExistingDataPoints: {
      type: "string[]",
      label: "Existing Data Points",
      description: "Existing data points of contacts to filter by.",
      optional: true,
    },
    searchContactLocation: {
      type: "string[]",
      label: "Contact Locations",
      description: "Location filters for contacts to search (JSON strings).",
      optional: true,
    },
    // Search Companies Props
    searchCompanyNames: {
      type: "string[]",
      label: "Company Names",
      description: "Names of companies to search.",
      optional: true,
      max: 100,
    },
    searchCompanyDomains: {
      type: "string[]",
      label: "Company Domains",
      description: "Domains of companies to search.",
      optional: true,
      max: 100,
    },
    searchCompanyLocations: {
      type: "string[]",
      label: "Company Locations",
      description: "Location filters for companies to search (JSON strings).",
      optional: true,
    },
    searchCompanySizes: {
      type: "string[]",
      label: "Company Sizes",
      description: "Size ranges of companies to search (JSON strings with min and max).",
      optional: true,
    },
    searchCompanyRevenues: {
      type: "string[]",
      label: "Company Revenues",
      description: "Revenue ranges of companies to search (JSON strings with min and max).",
      optional: true,
    },
    searchCompanySicCodes: {
      type: "string[]",
      label: "Company SIC Codes",
      description: "SIC codes of companies to search.",
      optional: true,
      max: 100,
    },
    searchCompanyNaicsCodes: {
      type: "string[]",
      label: "Company NAICS Codes",
      description: "NAICS codes of companies to search.",
      optional: true,
      max: 100,
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.lusha.com";
    },
    async _makeRequest({
      $ = this,
      method = "GET",
      path = "/",
      headers,
      ...otherOpts
    } = {}) {
      return axios($, {
        method,
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
          ...headers,
        },
        ...otherOpts,
      });
    },
    async findContact(args = {}) {
      const response = await this._makeRequest({
        method: "GET",
        path: "/person",
        ...args,
      });
      return response;
    },
    async findCompany(args = {}) {
      const response = await this._makeRequest({
        method: "GET",
        path: "/company",
        ...args,
      });
      return response;
    },
    // Search Contacts
    async searchContacts(args = {}) {
      const {
        searchContactNames,
        searchContactJobTitles,
        searchContactJobTitlesExactMatch,
        searchContactCountries,
        searchContactSeniority,
        searchContactDepartments,
        searchContactExistingDataPoints,
        searchContactLocation,
        page = 0,
        size = 20,
        ...otherOpts
      } = args;

      const filters = {
        contacts: {
          include: {},
        },
      };

      if (searchContactNames && searchContactNames.length > 0) {
        filters.contacts.include.names = searchContactNames;
      }
      if (searchContactJobTitles && searchContactJobTitles.length > 0) {
        filters.contacts.include.jobTitles = searchContactJobTitles;
      }
      if (searchContactJobTitlesExactMatch && searchContactJobTitlesExactMatch.length > 0) {
        filters.contacts.include.jobTitlesExactMatch = searchContactJobTitlesExactMatch;
      }
      if (searchContactCountries && searchContactCountries.length > 0) {
        filters.contacts.include.countries = searchContactCountries;
      }
      if (searchContactSeniority && searchContactSeniority.length > 0) {
        filters.contacts.include.seniority = searchContactSeniority;
      }
      if (searchContactDepartments && searchContactDepartments.length > 0) {
        filters.contacts.include.departments = searchContactDepartments;
      }
      if (searchContactExistingDataPoints && searchContactExistingDataPoints.length > 0) {
        filters.contacts.include.existingDataPoints = searchContactExistingDataPoints;
      }
      if (searchContactLocation && searchContactLocation.length > 0) {
        filters.contacts.include.location = searchContactLocation.map(JSON.parse);
      }

      const data = {
        pages: {
          page,
          size,
        },
        filters,
      };

      return this._makeRequest({
        method: "POST",
        path: "/prospecting/contact/search",
        data,
        ...otherOpts,
      });
    },
    // Search Companies
    async searchCompanies(args = {}) {
      const {
        searchCompanyNames,
        searchCompanyDomains,
        searchCompanyLocations,
        searchCompanySizes,
        searchCompanyRevenues,
        searchCompanySicCodes,
        searchCompanyNaicsCodes,
        page = 0,
        size = 20,
        ...otherOpts
      } = args;

      const filters = {
        companies: {
          include: {},
        },
      };

      if (searchCompanyNames && searchCompanyNames.length > 0) {
        filters.companies.include.names = searchCompanyNames;
      }
      if (searchCompanyDomains && searchCompanyDomains.length > 0) {
        filters.companies.include.domains = searchCompanyDomains;
      }
      if (searchCompanyLocations && searchCompanyLocations.length > 0) {
        filters.companies.include.locations = searchCompanyLocations.map(JSON.parse);
      }
      if (searchCompanySizes && searchCompanySizes.length > 0) {
        filters.companies.include.sizes = searchCompanySizes.map(JSON.parse);
      }
      if (searchCompanyRevenues && searchCompanyRevenues.length > 0) {
        filters.companies.include.revenues = searchCompanyRevenues.map(JSON.parse);
      }
      if (searchCompanySicCodes && searchCompanySicCodes.length > 0) {
        filters.companies.include.sicCodes = searchCompanySicCodes;
      }
      if (searchCompanyNaicsCodes && searchCompanyNaicsCodes.length > 0) {
        filters.companies.include.naicsCodes = searchCompanyNaicsCodes;
      }

      const data = {
        pages: {
          page,
          size,
        },
        filters,
      };

      return this._makeRequest({
        method: "POST",
        path: "/prospecting/company/search",
        data,
        ...otherOpts,
      });
    },
    // Enrich Contacts
    async enrichContacts(args = {}) {
      const {
        enrichContactRequestId, enrichContactIds, ...otherOpts
      } = args;

      const data = {
        requestId: enrichContactRequestId,
        contactIds: enrichContactIds,
      };

      return this._makeRequest({
        method: "POST",
        path: "/prospecting/contact/enrich",
        data,
        ...otherOpts,
      });
    },
    // Enrich Companies
    async enrichCompanies(args = {}) {
      const {
        enrichCompanyRequestId, enrichCompanyIds, ...otherOpts
      } = args;

      const data = {
        requestId: enrichCompanyRequestId,
        companyIds: enrichCompanyIds,
      };

      return this._makeRequest({
        method: "POST",
        path: "/prospecting/company/enrich",
        data,
        ...otherOpts,
      });
    },
    // Pagination Method
    async paginate(fn, ...opts) {
      let allResults = [];
      let page = 0;
      let size = 20;

      while (true) {
        const response = await fn({
          page,
          size,
          ...opts,
        });
        if (!response || !response.length || response.length === 0) {
          break;
        }
        allResults = allResults.concat(response);
        if (response.length < size) {
          break;
        }
        page += 1;
      }

      return allResults;
    },
  },
};
