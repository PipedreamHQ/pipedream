import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobMaterialUpdateFields } from "../common/job-material-fields.mjs";

export default {
  key: "servicem8-update-job-material",
  name: "Update Job Material",
  description: "Update a job material (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobmaterials)",
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
        "jobmaterialUuid",
      ],
    },
    ...buildPropsFromSchema(app, jobMaterialUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, jobMaterialUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "jobmaterial",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "jobmaterial",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Job Material ${this.uuid}`);
    return response;
  },
};
