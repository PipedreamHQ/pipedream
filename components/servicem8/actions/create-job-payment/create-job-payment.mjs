import app from "../../servicem8.app.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobPaymentCreateFields } from "../common/job-payment-fields.mjs";

export default {
  key: "servicem8-create-job-payment",
  name: "Create Job Payment",
  description: "Create a job payment. [See the documentation](https://developer.servicem8.com/reference/createjobpayments)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8: app,
    ...buildPropsFromSchema(app, jobPaymentCreateFields),
  },
  async run({ $ }) {
    const data = fieldsFromSchema(this, jobPaymentCreateFields);
    const {
      body, recordUuid,
    } = await this.servicem8.createResource({
      $,
      resource: "jobpayment",
      data,
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
