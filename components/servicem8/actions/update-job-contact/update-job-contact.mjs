import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobContactUpdateFields } from "../common/job-contact-fields.mjs";

export default {
  key: "servicem8-update-job-contact",
  name: "Update Job Contact",
  description: "Update a job contact (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobcontacts)",
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
        "jobcontactUuid",
      ],
    },
    ...buildPropsFromSchema(app, jobContactUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, jobContactUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "jobcontact",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "jobcontact",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Job Contact ${this.uuid}`);
    return response;
  },
};
