import app from "../../jobvetta.app.mjs";

export default {
  key: "jobvetta-estimate-salary",
  name: "Estimate Salary",
  description: "Calculate live P25, median (P50), and P75 base salary benchmarks from disclosed employer job postings. [See the documentation](https://www.jobvetta.com/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
      label: "Role Title",
      description: "Role title or skill to benchmark, e.g. `Staff Software Engineer`",
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    days: {
      propDefinition: [
        app,
        "days",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.estimateSalary({
      $,
      params: {
        q: this.q,
        location: this.location,
        days: this.days,
      },
    });
    $.export("$summary", `Calculated salary benchmark for "${this.q}" across ${response.disclosed_salary_count || 0} disclosed roles`);
    return response;
  },
};
