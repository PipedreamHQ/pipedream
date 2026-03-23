import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { companyCreateFields } from "../common/company-fields.mjs";

export default {
  key: "servicem8-create-company",
  name: "Create Company",
  description: "Create a company (client). [See the documentation](https://developer.servicem8.com/reference/createclients)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, companyCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, companyCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "company",
      data,
    });
    $.export("$summary", `Created Company${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
