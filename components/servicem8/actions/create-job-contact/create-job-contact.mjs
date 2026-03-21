import app from "../../servicem8.app.mjs";
import { recordProp } from "../common/props.mjs";

export default {
  key: "servicem8-create-job-contact",
  name: "Create Job Contact",
  description: `Create a new Job Contact. The new record UUID is returned in the result field recordUuid (HTTP header x-record-uuid). [See the documentation](https://developer.servicem8.com/docs/rest-overview)`,
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...recordProp,
  },
  async run({ $ }) {
    const { body, recordUuid } = await this.servicem8.createResource({
      $,
      resource: "jobcontact",
      data: this.record,
    });
    $.export("$summary", `Created Job Contact${recordUuid ? ` (${recordUuid})` : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
