import explorium from "../../explorium.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "explorium-fetch-prospects",
  name: "Fetch Prospects",
  description: "Fetches prospect records using filters. [See the documentation](https://developers.explorium.ai/reference/fetch_prospects)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    explorium,
    name: {
      propDefinition: [
        explorium,
        "name",
      ],
    },
    country: {
      propDefinition: [
        explorium,
        "country",
      ],
    },
    size: {
      propDefinition: [
        explorium,
        "size",
      ],
    },
    revenue: {
      propDefinition: [
        explorium,
        "revenue",
      ],
    },
    jobLevel: {
      type: "string[]",
      label: "Job Level",
      description: "Filter by job level",
      options: constants.PROSPECT_JOB_LEVELS,
      optional: true,
    },
    jobDepartment: {
      type: "string[]",
      label: "Job Department",
      description: "Filter by job department",
      options: constants.PROSPECT_JOB_DEPARTMENTS,
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.explorium.fetchProspects({
      $,
      data: {
        mode: "full",
        size: 100,
        page_size: 100,
        filters: {
          company_name: this.name
            ? {
              values: [
                this.name,
              ],
            }
            : undefined,
          country_code: this.country
            ? {
              values: [
                this.country,
              ],
            }
            : undefined,
          company_size: this.size
            ? {
              values: this.size,
            }
            : undefined,
          company_revenue: this.revenue
            ? {
              values: this.revenue,
            }
            : undefined,
          job_level: this.jobLevel
            ? {
              values: this.jobLevel,
            }
            : undefined,
          job_department: this.jobDepartment
            ? {
              values: this.jobDepartment,
            }
            : undefined,
        },
      },
    });
    $.export("$summary", `Fetched ${data.length} prospects`);
    return data;
  },
};
