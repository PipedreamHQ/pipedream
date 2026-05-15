import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-organization-search",
  name: "Search For Organizations",
  description: "Search the Apollo database for companies (organizations) using filters such as name, domain, employee count, location, technologies, revenue, funding, and job postings. [See the documentation](https://docs.apollo.io/reference/organization-search)",
  type: "action",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    qOrganizationName: {
      type: "string",
      label: "Organization Name",
      description: "Company name to search for (partial matches supported)",
      optional: true,
    },
    qOrganizationDomainsList: {
      type: "string[]",
      label: "Organization Domains",
      description: "Company domains to match (no www, no @). Example: `[\"apollo.io\", \"google.com\"]`",
      optional: true,
    },
    organizationIds: {
      propDefinition: [
        app,
        "organizationId",
      ],
      type: "string[]",
      label: "Organization IDs",
      description: "Specific Apollo organization IDs to filter results to",
      optional: true,
    },
    organizationNumEmployeesRanges: {
      type: "string[]",
      label: "Organization Employee Ranges",
      description: "Employee count ranges, formatted as `min,max`. Example: `[\"1,10\", \"250,500\"]`",
      optional: true,
    },
    organizationLocations: {
      type: "string[]",
      label: "Organization Locations",
      description: "HQ locations to include. Example: `[\"texas\", \"tokyo\", \"spain\"]`",
      optional: true,
    },
    organizationNotLocations: {
      type: "string[]",
      label: "Excluded Organization Locations",
      description: "HQ locations to exclude from results",
      optional: true,
    },
    currentlyUsingAnyOfTechnologyUids: {
      type: "string[]",
      label: "Technologies (UIDs)",
      description: "Apollo technology UIDs the company uses. Example: `[\"salesforce\", \"google_analytics\"]`",
      optional: true,
    },
    qOrganizationKeywordTags: {
      type: "string[]",
      label: "Organization Keyword Tags",
      description: "Keyword tags describing the company industry/focus. Example: `[\"sales strategy\", \"lead generation\"]`",
      optional: true,
    },
    revenueRangeMin: {
      type: "integer",
      label: "Revenue Range Min",
      description: "Minimum annual revenue (USD)",
      optional: true,
    },
    revenueRangeMax: {
      type: "integer",
      label: "Revenue Range Max",
      description: "Maximum annual revenue (USD)",
      optional: true,
    },
    latestFundingAmountMin: {
      type: "integer",
      label: "Latest Funding Amount Min",
      description: "Minimum latest funding round amount (USD)",
      optional: true,
    },
    latestFundingAmountMax: {
      type: "integer",
      label: "Latest Funding Amount Max",
      description: "Maximum latest funding round amount (USD)",
      optional: true,
    },
    totalFundingMin: {
      type: "integer",
      label: "Total Funding Min",
      description: "Minimum total funding raised (USD)",
      optional: true,
    },
    totalFundingMax: {
      type: "integer",
      label: "Total Funding Max",
      description: "Maximum total funding raised (USD)",
      optional: true,
    },
    latestFundingDateMin: {
      type: "string",
      label: "Latest Funding Date After",
      description: "Earliest date of the latest funding round (YYYY-MM-DD)",
      optional: true,
    },
    latestFundingDateMax: {
      type: "string",
      label: "Latest Funding Date Before",
      description: "Latest date of the latest funding round (YYYY-MM-DD)",
      optional: true,
    },
    qOrganizationJobTitles: {
      type: "string[]",
      label: "Org Job Posting Titles",
      description: "Job posting titles the company is hiring for",
      optional: true,
    },
    organizationJobLocations: {
      type: "string[]",
      label: "Org Job Posting Locations",
      description: "Locations of job postings at the company",
      optional: true,
    },
    organizationNumJobsMin: {
      type: "integer",
      label: "Org Open Jobs Min",
      description: "Minimum number of open job postings",
      optional: true,
    },
    organizationNumJobsMax: {
      type: "integer",
      label: "Org Open Jobs Max",
      description: "Maximum number of open job postings",
      optional: true,
    },
    organizationJobPostedAtMin: {
      type: "string",
      label: "Org Job Posted After",
      description: "Earliest date a job was posted (YYYY-MM-DD)",
      optional: true,
    },
    organizationJobPostedAtMax: {
      type: "string",
      label: "Org Job Posted Before",
      description: "Latest date a job was posted (YYYY-MM-DD)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      q_organization_name: this.qOrganizationName,
      q_organization_domains_list: this.qOrganizationDomainsList,
      organization_ids: this.organizationIds,
      organization_num_employees_ranges: this.organizationNumEmployeesRanges,
      organization_locations: this.organizationLocations,
      organization_not_locations: this.organizationNotLocations,
      currently_using_any_of_technology_uids: this.currentlyUsingAnyOfTechnologyUids,
      q_organization_keyword_tags: this.qOrganizationKeywordTags,
      q_organization_job_titles: this.qOrganizationJobTitles,
      organization_job_locations: this.organizationJobLocations,
      ...(this.revenueRangeMin !== undefined && {
        "revenue_range[min]": this.revenueRangeMin,
      }),
      ...(this.revenueRangeMax !== undefined && {
        "revenue_range[max]": this.revenueRangeMax,
      }),
      ...(this.latestFundingAmountMin !== undefined && {
        "latest_funding_amount_range[min]": this.latestFundingAmountMin,
      }),
      ...(this.latestFundingAmountMax !== undefined && {
        "latest_funding_amount_range[max]": this.latestFundingAmountMax,
      }),
      ...(this.totalFundingMin !== undefined && {
        "total_funding_range[min]": this.totalFundingMin,
      }),
      ...(this.totalFundingMax !== undefined && {
        "total_funding_range[max]": this.totalFundingMax,
      }),
      ...(this.latestFundingDateMin && {
        "latest_funding_date_range[min]": this.latestFundingDateMin,
      }),
      ...(this.latestFundingDateMax && {
        "latest_funding_date_range[max]": this.latestFundingDateMax,
      }),
      ...(this.organizationNumJobsMin !== undefined && {
        "organization_num_jobs_range[min]": this.organizationNumJobsMin,
      }),
      ...(this.organizationNumJobsMax !== undefined && {
        "organization_num_jobs_range[max]": this.organizationNumJobsMax,
      }),
      ...(this.organizationJobPostedAtMin && {
        "organization_job_posted_at_range[min]": this.organizationJobPostedAtMin,
      }),
      ...(this.organizationJobPostedAtMax && {
        "organization_job_posted_at_range[max]": this.organizationJobPostedAtMax,
      }),
    };

    const resourcesStream = this.app.getIterations({
      resourceFn: this.app.searchOrganizations,
      resourceFnArgs: {
        $,
        params,
      },
      resourceName: "organizations",
    });

    const organizations = await utils.iterate(resourcesStream);
    $.export("$summary", `Successfully fetched ${organizations.length} organizations.`);
    return organizations;
  },
};
