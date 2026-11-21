import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "jobspipe-new-job-matching-search",
  name: "New Job Matching Search",
  description: "Emit new event when a job posting matches your search criteria. Polls the JobsPipe search endpoint on a schedule and emits only new postings. [See the documentation](https://docs.jobspipe.dev/api-reference/jobs-search).",
  version: "0.0.2",
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
      description: "Only check postings newer than this many days (e.g. `1` for the last 24 hours). Recommended: set this to match your polling interval to avoid missing new jobs.",
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
      const postedAt = item.date_posted
        ? Date.parse(item.date_posted)
        : NaN;
      return {
        id: item.id,
        summary: `New job: ${item.job_title} at ${item.company}`,
        ts: Number.isFinite(postedAt)
          ? postedAt
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

    const lastJobIds = this._getLastJobIds().map(String);
    const isFirstRun = lastJobIds.length === 0;
    const seen = new Set(lastJobIds);
    const collectedIds = [];
    const newJobs = [];
    let firstPageJobs = [];
    let cursor;
    let pageCount = 0;
    const maxPages = isFirstRun
      ? 1
      : 50;

    do {
      const response = await this.jobspipe.searchJobs({
        data: {
          ...data,
          ...(cursor && {
            cursor,
          }),
        },
      });

      const jobs = response?.data || [];
      if (pageCount === 0) {
        firstPageJobs = jobs;
      }

      let reachedKnownJob = false;
      for (const job of jobs) {
        const id = String(job.id);
        collectedIds.push(id);
        if (seen.has(id)) {
          reachedKnownJob = true;
        } else if (!isFirstRun) {
          newJobs.push(job);
        }
      }

      cursor = response?.metadata?.next_cursor;
      pageCount++;

      if (isFirstRun || reachedKnownJob || !cursor || pageCount >= maxPages) {
        break;
      }
    } while (cursor);

    const jobsToEmit = isFirstRun
      ? firstPageJobs.slice(0, 25)
      : newJobs.slice().reverse();

    for (const job of jobsToEmit) {
      this.emitEvent(job);
    }

    const collected = new Set(collectedIds);
    const mergedIds = [
      ...collectedIds,
      ...lastJobIds.filter((id) => !collected.has(id)),
    ].slice(0, 200);
    this._setLastJobIds(mergedIds);
  },
};
