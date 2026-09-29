import app from "../../jobspipe.app.mjs";

export default {
  key: "jobspipe-search-jobs",
  name: "Search Jobs",
  description: "Search normalized live job postings via the JobsPipe API. [See the documentation](https://docs.jobspipe.dev/).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    jobTitleOr: {
      propDefinition: [
        app,
        "jobTitleOr",
      ],
    },
    jobTitleNot: {
      propDefinition: [
        app,
        "jobTitleNot",
      ],
    },
    descriptionOr: {
      propDefinition: [
        app,
        "descriptionOr",
      ],
    },
    countryCodes: {
      propDefinition: [
        app,
        "countryCodes",
      ],
    },
    locations: {
      propDefinition: [
        app,
        "locations",
      ],
    },
    cities: {
      propDefinition: [
        app,
        "cities",
      ],
    },
    skills: {
      propDefinition: [
        app,
        "skills",
      ],
    },
    companyNames: {
      propDefinition: [
        app,
        "companyNames",
      ],
    },
    remote: {
      propDefinition: [
        app,
        "remote",
      ],
    },
    employmentTypes: {
      propDefinition: [
        app,
        "employmentTypes",
      ],
    },
    workArrangements: {
      propDefinition: [
        app,
        "workArrangements",
      ],
    },
    seniorityLevels: {
      propDefinition: [
        app,
        "seniorityLevels",
      ],
    },
    postedAtMaxAgeDays: {
      propDefinition: [
        app,
        "postedAtMaxAgeDays",
      ],
    },
    minSalaryUsd: {
      propDefinition: [
        app,
        "minSalaryUsd",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      jobTitleOr,
      jobTitleNot,
      descriptionOr,
      countryCodes,
      locations,
      cities,
      skills,
      companyNames,
      remote,
      employmentTypes,
      workArrangements,
      seniorityLevels,
      postedAtMaxAgeDays,
      minSalaryUsd,
      limit,
      status,
      cursor,
    } = this;

    const data = {
      ...(jobTitleOr?.length && {
        job_title_or: jobTitleOr,
      }),
      ...(jobTitleNot?.length && {
        job_title_not: jobTitleNot,
      }),
      ...(descriptionOr?.length && {
        description_or: descriptionOr,
      }),
      ...(countryCodes?.length && {
        job_country_code_or: countryCodes,
      }),
      ...(locations?.length && {
        job_location_or: locations,
      }),
      ...(cities?.length && {
        city_or: cities,
      }),
      ...(skills?.length && {
        skills_or: skills,
      }),
      ...(companyNames?.length && {
        company_name_or: companyNames,
      }),
      ...(remote !== undefined && remote !== null && {
        remote,
      }),
      ...(employmentTypes?.length && {
        employment_type_or: employmentTypes,
      }),
      ...(workArrangements?.length && {
        work_arrangement_or: workArrangements,
      }),
      ...(seniorityLevels?.length && {
        job_seniority_or: seniorityLevels,
      }),
      ...(postedAtMaxAgeDays && {
        posted_at_max_age_days: postedAtMaxAgeDays,
      }),
      ...(minSalaryUsd !== undefined && minSalaryUsd !== null && {
        min_salary_usd: minSalaryUsd,
      }),
      ...(limit && {
        limit,
      }),
      ...(status && {
        status,
      }),
      ...(cursor && {
        cursor,
      }),
    };

    const response = await app.searchJobs({
      $,
      data,
    });

    const count = response?.data?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} job posting${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
