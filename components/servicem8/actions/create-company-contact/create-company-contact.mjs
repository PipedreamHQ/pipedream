import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { companyContactCreateFields } from "../common/company-contact-fields.mjs";

export default {
  key: "servicem8-create-company-contact",
  name: "Create Company Contact",
  description: "Create a company contact. [See the documentation](https://developer.servicem8.com/reference/createcompanycontacts)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, companyContactCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, companyContactCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "companycontact",
      data,
    });
    $.export("$summary", `Created Company Contact${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
