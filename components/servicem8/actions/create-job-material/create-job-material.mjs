import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobMaterialCreateFields } from "../common/job-material-fields.mjs";

export default {
  key: "servicem8-create-job-material",
  name: "Create Job Material",
  description: "Create a job material. [See the documentation](https://developer.servicem8.com/reference/createjobmaterials)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, jobMaterialCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, jobMaterialCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "jobmaterial",
      data,
    });
    $.export("$summary", `Created Job Material${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
