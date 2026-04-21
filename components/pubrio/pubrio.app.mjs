import { axios } from "@pipedream/platform";
import { parseJsonField } from "./common/utils.mjs";

export default {
  type: "app",
  app: "pubrio",
  propDefinitions: {
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name to search for",
      optional: true,
    },
    domains: {
      type: "string[]",
      label: "Domains",
      description: "Company domains (e.g. `google.com`)",
      optional: true,
    },
    locations: {
      type: "string[]",
      label: "Locations",
      description: "Location codes to filter by",
      optional: true,
      async options() {
        const items = await this.getLocations();
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
    },
    managementLevels: {
      type: "string[]",
      label: "Management Levels",
      description: "Seniority / management level codes",
      optional: true,
      async options() {
        const items = await this.getManagementLevels();
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
    },
    departments: {
      type: "string[]",
      label: "Departments",
      description: "Department title codes",
      optional: true,
      async options() {
        const items = await this.getDepartments();
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
    },
    departmentFunctions: {
      type: "string[]",
      label: "Department Functions",
      description: "Department function codes",
      optional: true,
      async options() {
        const items = await this.getDepartmentFunctions();
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
    },
    companySizes: {
      type: "string[]",
      label: "Company Sizes",
      description: "Company size range codes",
      optional: true,
      async options() {
        const items = await this.getCompanySizes();
        return Array.isArray(items)
          ? items.map((item) =>
            typeof item === "string"
              ? item
              : {
                label: item.name ?? item.label ?? item.code ?? String(item),
                value: item.code ?? item.value ?? item.name ?? String(item),
              })
          : [];
      },
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "General search term",
      optional: true,
    },
    lookupTypeDomain: {
      type: "string",
      label: "Lookup Type",
      description: "How to identify the company",
      options: [
        "domain",
        "domain_search_id",
        "linkedin_url",
        "domain_id",
      ],
    },
    lookupTypePerson: {
      type: "string",
      label: "Lookup Type",
      description: "How to identify the person",
      options: [
        "linkedin_url",
        "people_search_id",
      ],
    },
    lookupValue: {
      type: "string",
      label: "Value",
      description: "The domain, LinkedIn URL, or ID value",
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number",
      default: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Results per page (max 25)",
      default: 25,
      optional: true,
    },
  },
  methods: {
    parseJsonField,
    _baseUrl() {
      return "https://api.pubrio.com";
    },
    _headers() {
      return {
        "pubrio-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
      });
    },
    // Company endpoints
    searchCompanies(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/search",
        ...args,
      });
    },
    lookupCompany(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/lookup",
        ...args,
      });
    },
    enrichCompany(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/lookup/enrich",
        ...args,
      });
    },
    linkedinCompanyLookup(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/linkedin/lookup",
        ...args,
      });
    },
    findSimilarCompanies(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/lookalikes/search",
        ...args,
      });
    },
    lookupLookalike(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/lookalikes/lookup",
        ...args,
      });
    },
    // People endpoints
    searchPeople(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/people/search",
        ...args,
      });
    },
    lookupPerson(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/people/lookup",
        ...args,
      });
    },
    enrichPerson(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/people/enrichment",
        ...args,
      });
    },
    linkedinPersonLookup(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/people/linkedin/lookup",
        ...args,
      });
    },
    revealContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/redeem/people",
        ...args,
      });
    },
    batchRedeemContacts(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/redeem/people/batch",
        ...args,
      });
    },
    queryBatchRedeem(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/redeem/people/batch/query",
        ...args,
      });
    },
    // Intelligence signals
    searchJobs(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/jobs/search",
        ...args,
      });
    },
    lookupJob(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/jobs/lookup",
        ...args,
      });
    },
    searchNews(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/news/search",
        ...args,
      });
    },
    lookupNews(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/news/lookup",
        ...args,
      });
    },
    searchAds(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/advertisements/search",
        ...args,
      });
    },
    lookupAdvertisement(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/companies/advertisements/lookup",
        ...args,
      });
    },
    // Technology endpoints
    searchTechnologies(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/technologies",
        ...args,
      });
    },
    searchTechnologyCategories(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/technologies/categories",
        ...args,
      });
    },
    lookupTechnology(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/technologies/lookup",
        ...args,
      });
    },
    // Vertical endpoints
    searchVerticals(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verticals",
        ...args,
      });
    },
    searchVerticalCategories(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verticals/categories",
        ...args,
      });
    },
    searchVerticalSubCategories(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/verticals/sub_categories",
        ...args,
      });
    },
    // Reference data endpoints
    getLocations(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/locations",
        ...args,
      });
    },
    getManagementLevels(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/management_levels",
        ...args,
      });
    },
    getDepartments(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/departments/title",
        ...args,
      });
    },
    getDepartmentFunctions(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/departments/function",
        ...args,
      });
    },
    getCompanySizes(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/company_sizes",
        ...args,
      });
    },
    getNewsCategories(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/companies/news/categories",
        ...args,
      });
    },
    getNewsGalleries(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/companies/news/galleries",
        ...args,
      });
    },
    getNewsLanguages(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/companies/news/languages",
        ...args,
      });
    },
    getTimezones(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/timezones",
        ...args,
      });
    },
    // Profile endpoints
    getProfile(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/profile",
        ...args,
      });
    },
    getUsage(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/profile/usage",
        ...args,
      });
    },
    // Monitor endpoints
    listMonitors(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors",
        ...args,
      });
    },
    getMonitor(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/lookup",
        ...args,
      });
    },
    createMonitor(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/create",
        ...args,
      });
    },
    updateMonitor(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/update",
        ...args,
      });
    },
    deleteMonitor(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/delete",
        ...args,
      });
    },
    duplicateMonitor(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/duplicate",
        ...args,
      });
    },
    getMonitorStats(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/statistics",
        ...args,
      });
    },
    getMonitorChart(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/statistics/chart",
        ...args,
      });
    },
    getMonitorLogs(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/statistics/logs",
        ...args,
      });
    },
    getMonitorLogDetail(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/statistics/logs/lookup",
        ...args,
      });
    },
    testRunMonitor(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/process/try",
        ...args,
      });
    },
    retryMonitor(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/process/retry",
        ...args,
      });
    },
    revealMonitorSignature(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/signature/reveal",
        ...args,
      });
    },
    validateWebhook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/monitors/webhook/validate",
        ...args,
      });
    },
  },
};
