import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { categoryUpdateFields } from "../common/category-fields.mjs";

export default {
  key: "servicem8-update-category",
  name: "Update Category",
  description: "Update a category (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatecategories)",
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
        "categoryUuid",
      ],
    },
    ...buildPropsFromSchema(app, categoryUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, categoryUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "category",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "category",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Category ${this.uuid}`);
    return response;
  },
};
