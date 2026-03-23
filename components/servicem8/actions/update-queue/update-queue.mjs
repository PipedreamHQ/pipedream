import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { queueUpdateFields } from "../common/queue-fields.mjs";

export default {
  key: "servicem8-update-queue",
  name: "Update Job Queue",
  description: "Update a job queue (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobqueues)",
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
        "queueUuid",
      ],
    },
    ...buildPropsFromSchema(app, queueUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, queueUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "queue",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "queue",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Queue ${this.uuid}`);
    return response;
  },
};
