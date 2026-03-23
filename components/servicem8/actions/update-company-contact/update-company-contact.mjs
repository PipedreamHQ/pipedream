import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { companyContactUpdateFields } from "../common/company-contact-fields.mjs";

export default {
  key: "servicem8-update-company-contact",
  name: "Update Company Contact",
  description: "Update a company contact (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatecompanycontacts)",
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
        "companycontactUuid",
      ],
    },
    ...buildPropsFromSchema(app, companyContactUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, companyContactUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "companycontact",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "companycontact",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Company Contact ${this.uuid}`);
    return response;
  },
};
