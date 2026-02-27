import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-search-companies",
  name: "Search Companies",
  description: "Search for companies that meet a set of criteria. Returns up to 10,000,000 results. Cost: 3 credits per company URL returned. [See the documentation](https://enrichlayer.com/docs/api/v2/search-api/company-search).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    country: {
      propDefinition: [
        enrichlayer,
        "country",
      ],
      description: "Filter companies with an office in this country (Alpha-2 ISO 3166 code).",
    },
    region: {
      type: "string",
      label: "Region",
      description: "Filter by region/state/province. Wrap names with spaces in double quotes (e.g., `Maryland OR \"New York\"`).",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Filter by city. Wrap names with spaces in double quotes.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Company Name",
      description: "Filter companies by name using boolean search expression.",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "Filter by industry (includes inferred industries). Uses boolean search.",
      optional: true,
    },
    primaryIndustry: {
      type: "string",
      label: "Primary Industry",
      description: "Filter by primary industry only. Uses boolean search.",
      optional: true,
    },
    specialities: {
      type: "string",
      label: "Specialities",
      description: "Filter by company specialities using boolean search.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Filter by company description using boolean search.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Company Type",
      description: "Filter by company type.",
      optional: true,
      options: [
        "EDUCATIONAL",
        "GOVERNMENT_AGENCY",
        "NON_PROFIT",
        "PARTNERSHIP",
        "PRIVATELY_HELD",
        "PUBLIC_COMPANY",
        "SELF_EMPLOYED",
        "SELF_OWNED",
      ],
    },
    employeeCountCategory: {
      type: "string",
      label: "Employee Count Category",
      description: "Filter by employee count category. Takes precedence over min/max params.",
      optional: true,
      options: [
        {
          label: "Custom (default)",
          value: "custom",
        },
        {
          label: "Startup (1-10)",
          value: "startup",
        },
        {
          label: "Small (11-50)",
          value: "small",
        },
        {
          label: "Medium (51-250)",
          value: "medium",
        },
        {
          label: "Large (251-1000)",
          value: "large",
        },
        {
          label: "Enterprise (1001+)",
          value: "enterprise",
        },
      ],
    },
    employeeCountMin: {
      type: "integer",
      label: "Employee Count Min",
      description: "Filter companies with at least this many employees.",
      optional: true,
    },
    employeeCountMax: {
      type: "integer",
      label: "Employee Count Max",
      description: "Filter companies with at most this many employees.",
      optional: true,
    },
    followerCountMin: {
      type: "integer",
      label: "Follower Count Min",
      description: "Filter companies with more than this many followers.",
      optional: true,
    },
    followerCountMax: {
      type: "integer",
      label: "Follower Count Max",
      description: "Filter companies with fewer than this many followers.",
      optional: true,
    },
    foundedAfterYear: {
      type: "integer",
      label: "Founded After Year",
      description: "Filter companies founded after this year.",
      optional: true,
    },
    foundedBeforeYear: {
      type: "integer",
      label: "Founded Before Year",
      description: "Filter companies founded before this year.",
      optional: true,
    },
    fundingAmountMin: {
      type: "number",
      label: "Funding Amount Min (USD)",
      description: "Filter companies that have raised at least this much funding.",
      optional: true,
    },
    fundingAmountMax: {
      type: "number",
      label: "Funding Amount Max (USD)",
      description: "Filter companies that have raised at most this much funding.",
      optional: true,
    },
    fundingRaisedAfter: {
      type: "string",
      label: "Funding Raised After",
      description: "Filter companies that raised funding after this date (ISO 8601).",
      optional: true,
    },
    fundingRaisedBefore: {
      type: "string",
      label: "Funding Raised Before",
      description: "Filter companies that raised funding before this date (ISO 8601).",
      optional: true,
    },
    publicIdentifierInList: {
      type: "string",
      label: "Public Identifier In List",
      description: "Comma-separated list of company public identifiers to include.",
      optional: true,
    },
    publicIdentifierNotInList: {
      type: "string",
      label: "Public Identifier Not In List",
      description: "Comma-separated list of company public identifiers to exclude.",
      optional: true,
    },
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "Filter by company domain name.",
      optional: true,
    },
    enrichProfiles: {
      propDefinition: [
        enrichlayer,
        "enrichProfiles",
      ],
    },
    pageSize: {
      propDefinition: [
        enrichlayer,
        "pageSize",
      ],
      description: "Max results per API call. Default is 10 (max 100). When enriching, max is 10.",
    },
    useCache: {
      propDefinition: [
        enrichlayer,
        "useCache",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer.searchCompanies({
      $,
      params: {
        country: this.country,
        region: this.region,
        city: this.city,
        name: this.name,
        industry: this.industry,
        primary_industry: this.primaryIndustry,
        specialities: this.specialities,
        description: this.description,
        type: this.type,
        employee_count_category: this.employeeCountCategory,
        employee_count_min: this.employeeCountMin,
        employee_count_max: this.employeeCountMax,
        follower_count_min: this.followerCountMin,
        follower_count_max: this.followerCountMax,
        founded_after_year: this.foundedAfterYear,
        founded_before_year: this.foundedBeforeYear,
        funding_amount_min: this.fundingAmountMin,
        funding_amount_max: this.fundingAmountMax,
        funding_raised_after: this.fundingRaisedAfter,
        funding_raised_before: this.fundingRaisedBefore,
        public_identifier_in_list: this.publicIdentifierInList,
        public_identifier_not_in_list: this.publicIdentifierNotInList,
        domain_name: this.domainName,
        enrich_profiles: this.enrichProfiles,
        page_size: this.pageSize,
        use_cache: this.useCache,
      },
    });
    $.export("$summary", "Successfully searched companies");
    return response;
  },
};
