import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobActivityCreateFields } from "../common/job-activity-fields.mjs";

export default {
  key: "servicem8-create-job-activity",
  name: "Create Job Activity",
  description: "Create a job activity. [See the documentation](https://developer.servicem8.com/reference/createjobactivities)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, jobActivityCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, jobActivityCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "jobactivity",
      data,
    });
    $.export("$summary", `Created Job Activity${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
