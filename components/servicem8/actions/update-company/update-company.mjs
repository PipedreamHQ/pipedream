import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { companyUpdateFields } from "../common/company-fields.mjs";

export default {
  key: "servicem8-update-company",
  name: "Update Company",
  description: "Update a company (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updateclients)",
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
        "companyUuid",
      ],
    },
    ...buildPropsFromSchema(app, companyUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, companyUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "company",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "company",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Company ${this.uuid}`);
    return response;
  },
};
