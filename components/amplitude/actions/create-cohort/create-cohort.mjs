// x-pd-ai: optimized
import app from "../../amplitude.app.mjs";
import { COHORT_ID_TYPES } from "../../common/constants.mjs";

export default {
  key: "amplitude-create-cohort",
  name: "Create Cohort",
  description: "Create a static cohort in Amplitude from an explicit list of user or Amplitude IDs via `POST /api/3/cohorts/upload` (the only REST-documented cohort creation endpoint; behavioral/dynamic cohorts cannot be created via REST). Use **List Cohorts** to find an existing cohort ID if updating. Example: call with `cohortName=\"Power Users Q3\"`, `appId=849238`, `idType=\"BY_USER_ID\"`, `ids=[\"user@example.com\"]`, `owner=\"admin@example.com\"` -> returns `{cohortId: \"abc123\"}`. [See the documentation](https://amplitude.com/docs/apis/analytics/behavioral-cohorts#upload-cohort).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    app,
    cohortName: {
      type: "string",
      label: "Name",
      description: "Name of the cohort (the `name` field). Example: `Power Users Q3`.",
    },
    appId: {
      type: "integer",
      label: "App ID",
      description: "The numeric Amplitude project ID that owns the cohort (the `app_id` field). This isn't retrievable through any Amplitude REST API — find it in Amplitude under Settings > Projects, or in the project's Getting Started page. Example: `849238`.",
    },
    idType: {
      type: "string",
      label: "ID Type",
      description: "The type of identifiers provided in Ids (the `id_type` field). One of `BY_AMP_ID`, `BY_USER_ID`.",
      options: COHORT_ID_TYPES,
    },
    ids: {
      type: "string[]",
      label: "IDs",
      description: "Array of user or Amplitude IDs to include in the cohort (the `ids` field), matching the chosen ID Type. Example: `[\"12345678\",\"87654321\"]`.",
    },
    owner: {
      type: "string",
      label: "Owner",
      description: "Login email of the cohort owner (the `owner` field). Example: `user@example.com`.",
    },
    published: {
      type: "boolean",
      label: "Published",
      description: "Whether the cohort is published/shared (the `published` field).",
      optional: true,
    },
    groupName: {
      type: "string",
      label: "Group Name",
      description: "Optional group name for the cohort (the `cg` field).",
      optional: true,
    },
    skipInvalidIds: {
      type: "boolean",
      label: "Skip Invalid IDs",
      description: "When `true`, silently skip IDs that cannot be resolved instead of failing (the `skip_invalid_ids` field).",
      optional: true,
    },
    existingCohortId: {
      type: "string",
      label: "Existing Cohort ID",
      description: "Optional ID of an existing cohort to overwrite instead of creating a new one (the `existing_cohort_id` field). Use **List Cohorts** to find valid cohort IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createCohort({
      $,
      data: {
        name: this.cohortName,
        app_id: this.appId,
        id_type: this.idType,
        ids: this.ids,
        owner: this.owner,
        published: this.published,
        cg: this.groupName,
        skip_invalid_ids: this.skipInvalidIds,
        existing_cohort_id: this.existingCohortId,
      },
    });
    $.export("$summary", `Successfully created cohort "${this.cohortName}"${response.cohortId
      ? ` with ID ${response.cohortId}`
      : ""}`);
    return response;
  },
};
