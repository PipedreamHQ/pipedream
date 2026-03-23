import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { noteCreateFields } from "../common/note-fields.mjs";

export default {
  key: "servicem8-create-note",
  name: "Create Note",
  description: "Create a note. [See the documentation](https://developer.servicem8.com/reference/createnotes)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, noteCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, noteCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "note",
      data,
    });
    $.export("$summary", `Created Note${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
