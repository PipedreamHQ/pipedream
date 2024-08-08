import {
  CURRENCY_OPTIONS, EDUCATION_OPTIONS, EXPERIENCE_OPTIONS, INDUSTRY_OPTIONS,
  JOB_FUNCTION_OPTIONS,
  JOB_TYPE_OPTIONS,
  STATUS_OPTIONS, WORKPLACE_OPTIONS,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import smartymeet from "../../smartymeet.app.mjs";

export default {
  key: "smartymeet-create-job",
  name: "Create Job",
  description: "Generates a new job in the SmartyMeet system. [See the documentation](https://docs.smartymeet.com/smartymeet_versioned/jobs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    smartymeet,
    title: {
      type: "string",
      label: "Title",
      description: "The job's title.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The Job's status.",
      options: STATUS_OPTIONS,
      optional: true,
    },
    candidates: {
      type: "integer",
      label: "Candidates",
      description: "The candidates' quantity.",
      optional: true,
    },
    workplace: {
      type: "string",
      label: "workplace",
      description: "workplace",
      options: WORKPLACE_OPTIONS,
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The job's description.",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "The company industry.",
      options: INDUSTRY_OPTIONS,
      optional: true,
    },
    jobFunction: {
      type: "string",
      label: "Job Function",
      description: "The job function title.",
      options: JOB_FUNCTION_OPTIONS,
      optional: true,
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "The employment type.",
      options: JOB_TYPE_OPTIONS,
      optional: true,
    },
    experience: {
      type: "string",
      label: "Experience",
      description: "The expected candidate's experience.",
      options: EXPERIENCE_OPTIONS,
      optional: true,
    },
    education: {
      type: "string",
      label: "Education",
      description: "The expected candidate's education.",
      options: EDUCATION_OPTIONS,
      optional: true,
    },
    salaryFrom: {
      type: "string",
      label: "Salary From",
      description: "The minimum salary amount.",
      optional: true,
    },
    salaryTo: {
      type: "string",
      label: "Salary To",
      description: "The maximum salary amount.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The salary currency.",
      options: CURRENCY_OPTIONS,
      optional: true,
    },
    keywords: {
      type: "string[]",
      label: "keywords",
      description: "keywords",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smartymeet.createJob({
      $,
      data: {
        type: "jobs",
        attributes: {
          title: this.title,
          status: this.status,
          candidates: this.candidates,
          workplace: this.workplace,
          description: this.description,
          industry: this.industry,
          jobFunction: this.jobFunction,
          jobType: this.jobType,
          experience: this.experience,
          education: this.education,
          salary: {
            from: this.salaryFrom,
            to: this.salaryTo,
          },
          currency: this.currency,
          keywords: parseObject(this.keywords),
        },
      },
    });

    $.export("$summary", `Successfully created job with title "${this.jobTitle}"`);
    return response;
  },
};
