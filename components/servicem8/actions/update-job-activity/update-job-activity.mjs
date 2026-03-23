import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobActivityUpdateFields } from "../common/job-activity-fields.mjs";

export default {
  key: "servicem8-update-job-activity",
  name: "Update Job Activity",
  description: "Update a job activity (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobactivities)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    uuid: {
      propDefinition: [
        app,
        "jobactivityUuid",
      ],
    },
    ...buildPropsFromSchema(app, jobActivityUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, jobActivityUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "jobactivity",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "jobactivity",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Job Activity ${this.uuid}`);
    return response;
  },
};
