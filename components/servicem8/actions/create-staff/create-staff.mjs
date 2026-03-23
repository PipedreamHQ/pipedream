import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { staffCreateFields } from "../common/staff-fields.mjs";

export default {
  key: "servicem8-create-staff",
  name: "Create Staff Member",
  description: "Create a staff member. [See the documentation](https://developer.servicem8.com/reference/createstaffmembers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, staffCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, staffCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "staff",
      data,
    });
    $.export("$summary", `Created Staff Member${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
