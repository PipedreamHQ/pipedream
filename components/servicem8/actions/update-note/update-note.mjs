import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { noteUpdateFields } from "../common/note-fields.mjs";

export default {
  key: "servicem8-update-note",
  name: "Update Note",
  description: "Update a note (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatenotes)",
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
        "noteUuid",
      ],
    },
    ...buildPropsFromSchema(app, noteUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, noteUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "note",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "note",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Note ${this.uuid}`);
    return response;
  },
};
