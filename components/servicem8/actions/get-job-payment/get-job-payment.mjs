import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-job-payment",
  name: "Get Job Payment",
  description: "Retrieve a Job Payment by UUID. [See the documentation](https://developer.servicem8.com/reference/listjobpayments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.servicem8.getResource({
      $,
      resource: "jobpayment",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job Payment ${this.uuid}`);
    return response;
  },
};
