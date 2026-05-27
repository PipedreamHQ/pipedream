import app from "../../apollo_io.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "apollo_io-people-search",
  name: "People Search",
  description: "Find people in the Apollo database using filters such as titles, seniorities, locations, technologies, and employer attributes. Requires a master API key. Use **Search For Organizations** first to find Apollo organization IDs you want to filter by. [See the documentation](https://docs.apollo.io/reference/people-api-search)",
  type: "action",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    personTitles: {
      type: "string[]",
      label: "Person Titles",
      description: "Job titles to filter on (matches against current titles). Example: `[\"sales manager\", \"engineering manager\"]`",
      optional: true,
    },
    includeSimilarTitles: {
      type: "boolean",
      label: "Include Similar Titles",
      description: "When true, Apollo also matches semantically similar titles. Defaults to true on Apollo's side.",
      optional: true,
    },
    personLocations: {
      type: "string[]",
      label: "Person Locations",
      description: "Cities, US states, or countries where people live. Example: `[\"california\", \"chicago\", \"united kingdom\"]`",
      optional: true,
    },
    personSeniorities: {
      type: "string[]",
      label: "Person Seniorities",
      description: "Seniority levels. Allowed values: `owner`, `founder`, `c_suite`, `partner`, `vp`, `head`, `director`, `manager`, `senior`, `entry`, `intern`",
      optional: true,
    },
    contactEmailStatus: {
      type: "string[]",
      label: "Contact Email Status",
      description: "Email verification status. Allowed values: `verified`, `unverified`, `likely to engage`, `unavailable`",
      optional: true,
    },
    qKeywords: {
      type: "string",
      label: "Keywords",
      description: "Free-text keywords to match across names, titles, and companies",
      optional: true,
    },
    organizationIds: {
      propDefinition: [
        app,
        "organizationId",
      ],
      type: "string[]",
      label: "Organization IDs",
      description: "Apollo organization IDs the person currently works at",
      optional: true,
    },
    organizationNumEmployeesRanges: {
      type: "string[]",
      label: "Organization Employee Ranges",
      description: "Employee count ranges for the person's current company, formatted as `min,max`. Example: `[\"1,10\", \"250,500\"]`",
      optional: true,
    },
    organizationLocations: {
      type: "string[]",
      label: "Organization Locations",
      description: "HQ locations of the person's current company. Example: `[\"texas\", \"tokyo\", \"spain\"]`",
      optional: true,
    },
    organizationNotLocations: {
      type: "string[]",
      label: "Excluded Organization Locations",
      description: "Locations to EXCLUDE the person's current company from",
      optional: true,
    },
    qOrganizationDomainsList: {
      type: "string[]",
      label: "Organization Domains",
      description: "Company domains to match (no www, no @). Example: `[\"apollo.io\", \"google.com\"]`",
      optional: true,
    },
    qOrganizationKeywordTags: {
      type: "string[]",
      label: "Organization Keyword Tags",
      description: "Keyword tags describing the company industry/focus. Example: `[\"sales strategy\", \"lead generation\"]`",
      optional: true,
    },
    currentlyUsingAnyOfTechnologyUids: {
      type: "string[]",
      label: "Technologies (UIDs)",
      description: "Apollo technology UIDs the company uses. Example: `[\"salesforce\", \"google_analytics\"]`",
      optional: true,
    },
    revenueRangeMin: {
      type: "integer",
      label: "Revenue Range Min",
      description: "Minimum annual revenue (USD) for the person's company",
      optional: true,
    },
    revenueRangeMax: {
      type: "integer",
      label: "Revenue Range Max",
      description: "Maximum annual revenue (USD) for the person's company",
      optional: true,
    },
    qOrganizationJobTitles: {
      type: "string[]",
      label: "Org Job Posting Titles",
      description: "Job posting titles the person's company is hiring for",
      optional: true,
    },
    organizationJobLocations: {
      type: "string[]",
      label: "Org Job Posting Locations",
      description: "Locations of job postings at the person's company",
      optional: true,
    },
    organizationNumJobsMin: {
      type: "integer",
      label: "Org Open Jobs Min",
      description: "Minimum number of open job postings at the company",
      optional: true,
    },
    organizationNumJobsMax: {
      type: "integer",
      label: "Org Open Jobs Max",
      description: "Maximum number of open job postings at the company",
      optional: true,
    },
    organizationJobPostedAtMin: {
      type: "string",
      label: "Org Job Posted After",
      description: "Earliest date a job at the company was posted (YYYY-MM-DD)",
      optional: true,
    },
    organizationJobPostedAtMax: {
      type: "string",
      label: "Org Job Posted Before",
      description: "Latest date a job at the company was posted (YYYY-MM-DD)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      person_titles: this.personTitles,
      include_similar_titles: this.includeSimilarTitles,
      person_locations: this.personLocations,
      person_seniorities: this.personSeniorities,
      contact_email_status: this.contactEmailStatus,
      q_keywords: this.qKeywords,
      organization_ids: this.organizationIds,
      organization_num_employees_ranges: this.organizationNumEmployeesRanges,
      organization_locations: this.organizationLocations,
      organization_not_locations: this.organizationNotLocations,
      q_organization_domains_list: this.qOrganizationDomainsList,
      q_organization_keyword_tags: this.qOrganizationKeywordTags,
      currently_using_any_of_technology_uids: this.currentlyUsingAnyOfTechnologyUids,
      q_organization_job_titles: this.qOrganizationJobTitles,
      organization_job_locations: this.organizationJobLocations,
      ...(this.revenueRangeMin !== undefined && {
        "revenue_range[min]": this.revenueRangeMin,
      }),
      ...(this.revenueRangeMax !== undefined && {
        "revenue_range[max]": this.revenueRangeMax,
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
      resourceFn: this.app.peopleSearch,
      resourceFnArgs: {
        $,
        params,
      },
      resourceName: "people",
    });

    const people = await utils.iterate(resourcesStream);
    $.export("$summary", `Successfully fetched ${people.length} people.`);
    return people;
  },
};
