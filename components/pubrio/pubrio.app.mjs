import { axios } from "@pipedream/platform";
import {
  splitComma, parseJsonField,
} from "./common/utils.mjs";

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
        const items = await this.listLocations();
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
        const items = await this.listManagementLevels();
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
        const items = await this.listDepartments();
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
        const items = await this.listDepartmentFunctions();
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
        const items = await this.listCompanySizes();
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
    splitComma,
    parseJsonField,
    getBaseUrl() {
      return "https://api.pubrio.com";
    },
    getHeaders() {
      return {
        "pubrio-api-key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async makeRequest(opts = {}) {
      const {
        $ = this, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        baseURL: this.getBaseUrl(),
        headers: this.getHeaders(),
      });
    },
    async listLocations() {
      const response = await this.makeRequest({
        url: "/locations",
        method: "GET",
      });
      return response?.data ?? response ?? [];
    },
    async listManagementLevels() {
      const response = await this.makeRequest({
        url: "/management_levels",
        method: "GET",
      });
      return response?.data ?? response ?? [];
    },
    async listDepartments() {
      const response = await this.makeRequest({
        url: "/departments/title",
        method: "GET",
      });
      return response?.data ?? response ?? [];
    },
    async listDepartmentFunctions() {
      const response = await this.makeRequest({
        url: "/departments/function",
        method: "GET",
      });
      return response?.data ?? response ?? [];
    },
    async listCompanySizes() {
      const response = await this.makeRequest({
        url: "/company_sizes",
        method: "GET",
      });
      return response?.data ?? response ?? [];
    },
  },
};
