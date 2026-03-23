import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { categoryCreateFields } from "../common/category-fields.mjs";

export default {
  key: "servicem8-create-category",
  name: "Create Category",
  description: "Create a job category. [See the documentation](https://developer.servicem8.com/reference/createcategories)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, categoryCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, categoryCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "category",
      data,
    });
    $.export("$summary", `Created Category${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
