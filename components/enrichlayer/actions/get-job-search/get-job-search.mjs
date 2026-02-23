import enrichlayer from "../../enrichlayer.app.mjs";

export default {
  key: "enrichlayer-get-job-search",
  name: "Get Job Search",
  description: "List jobs posted by a company on professional networks. Cost: 2 credits per successful request. [See the docs](https://enrichlayer.com/docs).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    searchId: {
      type: "string",
      label: "Company Search ID",
      description: "The `search_id` of the company. Obtain via the Company Profile endpoint.",
      optional: true,
    },
    jobType: {
      type: "string",
      label: "Job Type",
      description: "Filter by the nature of the job.",
      optional: true,
      options: [
        {
          label: "Anything (default)",
          value: "anything",
        },
        {
          label: "Full-Time",
          value: "full-time",
        },
        {
          label: "Part-Time",
          value: "part-time",
        },
        {
          label: "Contract",
          value: "contract",
        },
        {
          label: "Internship",
          value: "internship",
        },
        {
          label: "Temporary",
          value: "temporary",
        },
        {
          label: "Volunteer",
          value: "volunteer",
        },
      ],
    },
    experienceLevel: {
      type: "string",
      label: "Experience Level",
      description: "Filter by experience level required.",
      optional: true,
      options: [
        {
          label: "Anything (default)",
          value: "anything",
        },
        {
          label: "Internship",
          value: "internship",
        },
        {
          label: "Entry Level",
          value: "entry_level",
        },
        {
          label: "Associate",
          value: "associate",
        },
        {
          label: "Mid-Senior Level",
          value: "mid_senior_level",
        },
        {
          label: "Director",
          value: "director",
        },
      ],
    },
    when: {
      type: "string",
      label: "When Posted",
      description: "Filter by when the job was posted.",
      optional: true,
      options: [
        {
          label: "Anytime (default)",
          value: "anytime",
        },
        {
          label: "Yesterday",
          value: "yesterday",
        },
        {
          label: "Past Week",
          value: "past-week",
        },
        {
          label: "Past Month",
          value: "past-month",
        },
      ],
    },
    flexibility: {
      type: "string",
      label: "Flexibility",
      description: "Filter by work flexibility.",
      optional: true,
      options: [
        {
          label: "Anything (default)",
          value: "anything",
        },
        {
          label: "Remote",
          value: "remote",
        },
        {
          label: "On-Site",
          value: "on-site",
        },
        {
          label: "Hybrid",
          value: "hybrid",
        },
      ],
    },
    geoId: {
      type: "string",
      label: "Geo ID",
      description: "The `geo_id` of the location to search (e.g., `92000000` for worldwide).",
      optional: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Keyword to search for in job listings.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer._makeRequest({
      $,
      path: "/api/v2/company/job",
      params: {
        search_id: this.searchId,
        job_type: this.jobType,
        experience_level: this.experienceLevel,
        when: this.when,
        flexibility: this.flexibility,
        geo_id: this.geoId,
        keyword: this.keyword,
      },
    });
    $.export("$summary", "Successfully retrieved job listings");
    return response;
  },
};
