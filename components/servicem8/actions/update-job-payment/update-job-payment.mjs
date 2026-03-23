import app from "../../servicem8.app.mjs";
import { buildUpdateBody } from "../../common/payload.mjs";
import {
  buildPropsFromSchema,
  fieldsFromSchema,
} from "../../common/action-schema.mjs";
import { jobPaymentUpdateFields } from "../common/job-payment-fields.mjs";

export default {
  key: "servicem8-update-job-payment",
  name: "Update Job Payment",
  description: "Update a job payment (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobpayments)",
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
        "jobpaymentUuid",
      ],
    },
    ...buildPropsFromSchema(app, jobPaymentUpdateFields),
  },
  async run({ $ }) {
    const patch = fieldsFromSchema(this, jobPaymentUpdateFields);
    const data = await buildUpdateBody(this.servicem8, {
      $,
      resource: "jobpayment",
      uuid: this.uuid,
      fields: patch,
    });
    const response = await this.servicem8.updateResource({
      $,
      resource: "jobpayment",
      uuid: this.uuid,
      data,
    });
    $.export("$summary", `Updated Job Payment ${this.uuid}`);
    return response;
  },
};
