import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobContactCreateFields } from "../common/job-contact-fields.mjs";

export default {
  key: "servicem8-create-job-contact",
  name: "Create Job Contact",
  description: "Create a job contact. [See the documentation](https://developer.servicem8.com/reference/createjobcontacts)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, jobContactCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, jobContactCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "jobcontact",
      data,
    });
    $.export("$summary", `Created Job Contact${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
