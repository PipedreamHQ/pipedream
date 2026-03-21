import app from "../../servicem8.app.mjs";
import { recordProp } from "../common/props.mjs";

export default {
  key: "servicem8-create-job-payment",
  name: "Create Job Payment",
  description: "Create a new Job Payment. The new record UUID is returned in the result field recordUuid (HTTP header x-record-uuid). [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
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
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "jobpayment",
      data: this.record,
    });
    $.export("$summary", `Created Job Payment${recordUuid
      ? ` (${recordUuid})`
      : ""}`);
    return {
      body,
      recordUuid,
    };
  },
};
