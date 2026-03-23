import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobUpdateFields } from "../common/job-fields.mjs";

export default {
  key: "servicem8-update-job",
  name: "Update Job",
  description: "Update a job (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobs)",
  version: "0.0.3",
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
        "jobUuid",
      ],
    },
    ...buildPropsFromSchema(app, jobUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, jobUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "job",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "job",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Job ${this.uuid}`);
    return response;
  },
};
