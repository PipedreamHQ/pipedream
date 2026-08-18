// x-pd-ai: optimized
import app from "../../amplitude.app.mjs";
import { COHORT_DEFAULT_FIELDS } from "../../common/constants.mjs";
import { pluck } from "../../common/utils.mjs";

export default {
  key: "amplitude-list-cohorts",
  name: "List Cohorts",
  description: `List all behavioral cohorts in the Amplitude project. Returns a \`cohorts\` array; each entry defaults to ${COHORT_DEFAULT_FIELDS.join(", ")}. Pass \`fields\` to get more, e.g. \`description\`, \`published\`, \`archived\`, or the large \`definition\` (the cohort's filter logic) / \`owners\`/\`viewers\` (email arrays). Use this to discover valid cohort IDs for **Request Cohort Download** (step 1 of 3, followed by **Get Cohort Download Status** and **Download Cohort File**, to fetch a cohort's member list). Example: call with no parameters -> returns \`{cohorts: [{id: "abc123", name: "Power Users Q3", size: 4200, lastMod: 1722873600000, appId: 849238}, ...]}\`. [See the documentation](https://amplitude.com/docs/apis/analytics/behavioral-cohorts#get-all-cohorts).`,
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    includeSyncInfo: {
      type: "boolean",
      label: "Include Sync Info",
      description: "When `true`, include cohort sync metadata in the response (the `includeSyncInfo` param) — each cohort's `syncMetadata` field is then always kept regardless of `fields`.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      optional: true,
      description: `Field names to return for each cohort (\`id\` is always included). Defaults to: ${COHORT_DEFAULT_FIELDS.join(", ")}. Also available: \`description\`, \`published\`, \`archived\`, \`createdAt\`, \`lastComputed\`, \`definition\`, \`owners\`, \`viewers\`, \`syncMetadata\` (auto-included when Include Sync Info is \`true\`). Pass only what you need to keep responses small.`,
    },
  },
  async run({ $ }) {
    const response = await this.app.listCohorts({
      $,
      params: {
        includeSyncInfo: this.includeSyncInfo,
      },
    });

    const fields = this.fields?.length
      ? this.fields
      : COHORT_DEFAULT_FIELDS;
    const alwaysFields = this.includeSyncInfo
      ? [
        "id",
        "syncMetadata",
      ]
      : [
        "id",
      ];
    const cohorts = (response.cohorts ?? []).map((cohort) => pluck(cohort, fields, alwaysFields));

    $.export("$summary", `Successfully listed ${cohorts.length} cohort(s)`);
    return {
      ...response,
      cohorts,
    };
  },
};
