// x-pd-ai: optimized
import app from "../../amplitude.app.mjs";

export default {
  key: "amplitude-get-cohort",
  name: "Get Cohort",
  description: "Retrieve a single behavioral cohort's full metadata (`id`, `name`, `size`, `definition`, and more) by its ID from the Amplitude Behavioral Cohorts API. Use **List Cohorts** first to discover valid cohort IDs. Example: call with `cohortId=\"abc123\"` -> returns `{id: \"abc123\", name: \"Power Users Q3\", size: 4200, definition: {...}, appId: 849238, published: true}`. [See the documentation](https://amplitude.com/docs/apis/analytics/behavioral-cohorts#get-one-cohort).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    cohortId: {
      type: "string",
      label: "Cohort ID",
      description: "The ID of the cohort to retrieve. This is a free-form string; run **List Cohorts** first to discover valid cohort IDs. Example: `abc123`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getCohort({
      $,
      cohortId: this.cohortId,
    });
    $.export("$summary", `Successfully retrieved cohort ${this.cohortId}`);
    return response;
  },
};
