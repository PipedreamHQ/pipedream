import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { queueCreateFields } from "../common/queue-fields.mjs";

export default {
  key: "servicem8-create-queue",
  name: "Create Job Queue",
  description: "Create a job queue. [See the documentation](https://developer.servicem8.com/reference/createjobqueues)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, queueCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, queueCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "queue",
      data,
    });
    $.export("$summary", `Created Job Queue${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
