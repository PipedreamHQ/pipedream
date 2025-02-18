import app from "../../demandbase.app.mjs";
import utils from "../../common/utils.mjs";
import agents from "../../common/agents.mjs";
import states from "../../common/states.mjs";

export default {
  key: "demandbase-company-lookup",
  name: "Company Lookup",
  description: "Build a list of company names along with company ID, city, state and country using rich filters.. [See the documentation](https://kb.demandbase.com/hc/en-us/articles/7273850579227--POST-Company-Lookup).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    agents: {
      type: "string[]",
      label: "Agents",
      description: "The agent IDs.",
      optional: true,
      options: Object.values(agents),
    },
    areaCodes: {
      type: "string[]",
      label: "Area Codes",
      description: "List of area codes.",
      optional: true,
    },
    businessTypes: {
      type: "string[]",
      label: "Business Types",
      description: "List of business types.",
      optional: true,
      options: [
        "public",
        "private",
        "school",
        "government",
        "organization",
      ],
    },
    cities: {
      type: "string[]",
      label: "Cities",
      description: "List of cities.",
      optional: true,
    },
    companyStatus: {
      type: "string[]",
      label: "Company Status",
      description: "List of company statuses.",
      optional: true,
      options: [
        "operating",
        "subsidiary",
        "acquired",
      ],
    },
    countries: {
      type: "string[]",
      label: "Countries",
      description: "List of country IDs.",
      propDefinition: [
        app,
        "countryId",
      ],
    },
    fiscalYearEnd: {
      type: "string",
      label: "Fiscal Year End",
      description: "The fiscal year end. Eg. `january`.",
      optional: true,
    },
    fortuneRanking: {
      type: "string",
      label: "Fortune Ranking",
      description: "The fortune ranking.",
      optional: true,
      options: [
        "fortune500",
        "fortune1000",
      ],
    },
    industries: {
      propDefinition: [
        app,
        "industries",
      ],
    },
    subIndustries: {
      label: "Sub Industries",
      description: "List of sub industry IDs.",
      propDefinition: [
        app,
        "industries",
        ({ industries: industryIds }) => ({
          listSubindustries: true,
          industryIds,
        }),
      ],
    },
    keywords: {
      type: "string",
      label: "Keywords",
      description: "Keywords.",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Name of the company.",
      optional: true,
    },
    minEmployees: {
      type: "integer",
      label: "Min Employees",
      description: "Minimum number of employees.",
      optional: true,
    },
    maxEmployees: {
      type: "integer",
      label: "Max Employees",
      description: "Maximum number of employees.",
      optional: true,
    },
    minRevenue: {
      type: "integer",
      label: "Min Revenue",
      description: "Minimum revenue (Millions of $).",
      optional: true,
    },
    maxRevenue: {
      type: "integer",
      label: "Max Revenue",
      description: "Maximum revenue (Millions of $).",
      optional: true,
    },
    categoryIds: {
      propDefinition: [
        app,
        "categoryIds",
      ],
    },
    hasPhone: {
      type: "boolean",
      label: "Has Phone",
      description: "View companies with a phone number.",
      optional: true,
    },
    regions: {
      type: "string[]",
      label: "Regions",
      description: "List of regions.",
      optional: true,
      options: [
        "Africa",
        "Asia",
        "Europe",
        "MiddleEast",
        "NorthAmerica",
        "Oceania",
        "SouthAmerica",
      ],
    },
    street: {
      type: "string",
      label: "Street",
      description: "Street name.",
      optional: true,
    },
    state: {
      type: "string[]",
      label: "States",
      description: "List of state IDs.",
      optional: true,
      options: states,
    },
    zipCodes: {
      type: "string[]",
      label: "Zip Codes",
      description: "List of zip codes.",
      optional: true,
    },
    businessStructure: {
      type: "string",
      label: "Business Structure",
      description: "Business structure.",
      optional: true,
      options: [
        "globalParent",
        "uncategorized",
        "subsidiary",
        "group",
        "independent",
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Attributes used to sort the list of results.",
      optional: true,
      options: [
        "popularity",
        "revenue",
        "employee_count",
        "businessType",
        "location",
      ],
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort order.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
  },
  methods: {
    companyLookup(args = {}) {
      return this.app.post({
        path: "/target/company/lookup",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      companyLookup,
      agents,
      areaCodes,
      businessTypes,
      cities,
      companyStatus,
      countries,
      fiscalYearEnd,
      fortuneRanking,
      industries,
      subIndustries,
      keywords,
      companyName,
      minEmployees,
      maxEmployees,
      minRevenue,
      maxRevenue,
      categoryIds,
      hasPhone,
      regions,
      street,
      state,
      zipCodes,
      sortBy,
      sortOrder,
    } = this;

    const response = await companyLookup({
      $,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: utils.getUrlEncodedData({
        agents,
        areaCodes,
        businessTypes,
        cities,
        companyStatus,
        countries,
        fiscalYearEnd,
        fortuneRanking,
        industries,
        subIndustries,
        keywords,
        companyName,
        minEmployees,
        maxEmployees,
        minRevenue,
        maxRevenue,
        categoryIds,
        hasPhone,
        regions,
        street,
        state,
        zipCodes,
        sortBy,
        sortOrder,
      }),
    });
    $.export("$summary", "Successfully built company list.");
    return response;
  },
};
