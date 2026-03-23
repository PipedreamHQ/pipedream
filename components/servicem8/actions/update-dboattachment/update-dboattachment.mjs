import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { dboattachmentUpdateFields } from "../common/dboattachment-fields.mjs";

export default {
  key: "servicem8-update-dboattachment",
  name: "Update Attachment",
  description: "Update an attachment (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updateattachments)",
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
        "dboattachmentUuid",
      ],
    },
    ...buildPropsFromSchema(app, dboattachmentUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, dboattachmentUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "dboattachment",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "dboattachment",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Attachment ${this.uuid}`);
    return response;
  },
};
