import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { dboattachmentCreateFields } from "../common/dboattachment-fields.mjs";

export default {
  key: "servicem8-create-dboattachment",
  name: "Create Attachment",
  description: "Create an attachment. [See the documentation](https://developer.servicem8.com/reference/createattachments)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, dboattachmentCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, dboattachmentCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "dboattachment",
      data,
    });
    $.export("$summary", `Created Attachment${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
