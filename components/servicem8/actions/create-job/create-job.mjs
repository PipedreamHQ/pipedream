import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobCreateFields } from "../common/job-fields.mjs";

export default {
  key: "servicem8-create-job",
  name: "Create Job",
  description: "Create a job. [See the documentation](https://developer.servicem8.com/reference/createjobs)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, jobCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, jobCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "job",
      data,
    });
    $.export("$summary", `Created Job${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
