import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "jobspipe-new-job-matching-search",
  name: "New Job Matching Search",
  description: "Emit new event when a job posting matches your search criteria. Polls the JobsPipe search endpoint on a schedule and emits only new postings.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    jobTitleOr: {
      propDefinition: [
        common.props.jobspipe,
        "jobTitleOr",
      ],
    },
    jobTitleNot: {
      propDefinition: [
        common.props.jobspipe,
        "jobTitleNot",
      ],
    },
    descriptionOr: {
      propDefinition: [
        common.props.jobspipe,
        "descriptionOr",
      ],
    },
    countryCodes: {
      propDefinition: [
        common.props.jobspipe,
        "countryCodes",
      ],
    },
    locations: {
      propDefinition: [
        common.props.jobspipe,
        "locations",
      ],
    },
    cities: {
      propDefinition: [
        common.props.jobspipe,
        "cities",
      ],
    },
    skills: {
      propDefinition: [
        common.props.jobspipe,
        "skills",
      ],
    },
    companyNames: {
      propDefinition: [
        common.props.jobspipe,
        "companyNames",
      ],
    },
    remote: {
      propDefinition: [
        common.props.jobspipe,
        "remote",
      ],
    },
    employmentTypes: {
      propDefinition: [
        common.props.jobspipe,
        "employmentTypes",
      ],
    },
    workArrangements: {
      propDefinition: [
        common.props.jobspipe,
        "workArrangements",
      ],
    },
    seniorityLevels: {
      propDefinition: [
        common.props.jobspipe,
        "seniorityLevels",
      ],
    },
    postedAtMaxAgeDays: {
      propDefinition: [
        common.props.jobspipe,
        "postedAtMaxAgeDays",
      ],
      description: "Only check postings newer than this many days. Recommended: set this to match your polling interval to avoid missing new jobs.",
      default: 1,
    },
    minSalaryUsd: {
      propDefinition: [
        common.props.jobspipe,
        "minSalaryUsd",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New job: ${item.title} at ${item.company}`,
        ts: item.posted_at
          ? new Date(item.posted_at).getTime()
          : Date.now(),
      };
    },
  },
  async run() {
    const data = {
      ...(this.jobTitleOr?.length && {
        job_title_or: this.jobTitleOr,
      }),
      ...(this.jobTitleNot?.length && {
        job_title_not: this.jobTitleNot,
      }),
      ...(this.descriptionOr?.length && {
        description_or: this.descriptionOr,
      }),
      ...(this.countryCodes?.length && {
        job_country_code_or: this.countryCodes,
      }),
      ...(this.locations?.length && {
        job_location_or: this.locations,
      }),
      ...(this.cities?.length && {
        city_or: this.cities,
      }),
      ...(this.skills?.length && {
        skills_or: this.skills,
      }),
      ...(this.companyNames?.length && {
        company_name_or: this.companyNames,
      }),
      ...(this.remote !== undefined && this.remote !== null && {
        remote: this.remote,
      }),
      ...(this.employmentTypes?.length && {
        employment_type_or: this.employmentTypes,
      }),
      ...(this.workArrangements?.length && {
        work_arrangement_or: this.workArrangements,
      }),
      ...(this.seniorityLevels?.length && {
        job_seniority_or: this.seniorityLevels,
      }),
      ...(this.postedAtMaxAgeDays && {
        posted_at_max_age_days: this.postedAtMaxAgeDays,
      }),
      ...(this.minSalaryUsd !== undefined && this.minSalaryUsd !== null && {
        min_salary_usd: this.minSalaryUsd,
      }),
      status: "active",
      limit: 100,
    };

    const response = await this.jobspipe.searchJobs({
      data,
    });

    const jobs = response?.data || [];
    const lastJobIds = this._getLastJobIds();
    const newJobIds = [];

    for (const job of jobs) {
      if (!lastJobIds.includes(job.id)) {
        this.emitEvent(job);
      }
      newJobIds.push(job.id);
    }

    this._setLastJobIds(newJobIds.slice(0, 200));
  },
};
