import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { staffUpdateFields } from "../common/staff-fields.mjs";

export default {
  key: "servicem8-update-staff",
  name: "Update Staff Member",
  description: "Update a staff member (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatestaffmembers)",
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
        "staffUuid",
      ],
    },
    ...buildPropsFromSchema(app, staffUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, staffUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "staff",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "staff",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Staff ${this.uuid}`);
    return response;
  },
};
