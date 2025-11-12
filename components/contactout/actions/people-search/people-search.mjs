import app from "../../contactout.app.mjs";

export default {
  key: "contactout-people-search",
  name: "People Search",
  description: "Search for people based on various criteria like name, company, title, location, skills, and more. [See the documentation](https://api.contactout.com/#people-search-api).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    jobTitle: {
      propDefinition: [
        app,
        "jobTitle",
      ],
    },
    currentTitlesOnly: {
      propDefinition: [
        app,
        "currentTitlesOnly",
      ],
    },
    includeRelatedJobTitles: {
      propDefinition: [
        app,
        "includeRelatedJobTitles",
      ],
    },
    matchExperience: {
      propDefinition: [
        app,
        "matchExperience",
      ],
    },
    skills: {
      propDefinition: [
        app,
        "skills",
      ],
    },
    education: {
      propDefinition: [
        app,
        "education",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    company: {
      propDefinition: [
        app,
        "company",
      ],
    },
    companyFilter: {
      propDefinition: [
        app,
        "companyFilter",
      ],
    },
    currentCompanyOnly: {
      propDefinition: [
        app,
        "currentCompanyOnly",
      ],
    },
    domain: {
      type: "string[]",
      label: "Domains",
      description: "Array of company domains to search for (max 50)",
      optional: true,
    },
    industry: {
      propDefinition: [
        app,
        "industry",
      ],
    },
    keyword: {
      propDefinition: [
        app,
        "keyword",
      ],
    },
    companySize: {
      propDefinition: [
        app,
        "companySize",
      ],
    },
    yearsOfExperience: {
      propDefinition: [
        app,
        "yearsOfExperience",
      ],
    },
    yearsInCurrentRole: {
      propDefinition: [
        app,
        "yearsInCurrentRole",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    dataTypes: {
      propDefinition: [
        app,
        "dataTypes",
      ],
    },
    revealInfo: {
      propDefinition: [
        app,
        "revealInfo",
      ],
    },
  },
  async run({ $ }) {
    const {
      name,
      jobTitle,
      currentTitlesOnly,
      includeRelatedJobTitles,
      matchExperience,
      skills,
      education,
      location,
      company,
      companyFilter,
      currentCompanyOnly,
      domain,
      industry,
      keyword,
      companySize,
      yearsOfExperience,
      yearsInCurrentRole,
      page,
      dataTypes,
      revealInfo,
    } = this;

    const response = await this.app.searchPeople({
      $,
      data: {
        name,
        job_title: jobTitle,
        current_titles_only: currentTitlesOnly,
        include_related_job_titles: includeRelatedJobTitles,
        match_experience: matchExperience,
        skills,
        education,
        location,
        company,
        company_filter: companyFilter,
        current_company_only: currentCompanyOnly,
        domain,
        industry,
        keyword,
        company_size: companySize,
        years_of_experience: yearsOfExperience,
        years_in_current_role: yearsInCurrentRole,
        page,
        data_types: dataTypes,
        reveal_info: revealInfo,
      },
    });

    $.export("$summary", "Successfully searched for people");
    return response;
  },
};
