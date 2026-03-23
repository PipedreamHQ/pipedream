import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { badgeCreateFields } from "../common/badge-fields.mjs";

export default {
  key: "servicem8-create-badge",
  name: "Create Badge",
  description: "Create a badge. [See the documentation](https://developer.servicem8.com/reference/createbadges)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, badgeCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, badgeCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "badge",
      data,
    });
    $.export("$summary", `Created Badge${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
