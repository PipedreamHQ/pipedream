import app from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-job-payment",
  name: "Delete Job Payment",
  description: "Delete a Job Payment by UUID. [See the documentation](https://developer.servicem8.com/docs/rest-overview)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
  },
  async run({ $ }) {
    const response = await this.servicem8.deleteResource({
      $,
      resource: "jobpayment",
      uuid: this.uuid,
    });
    $.export("$summary", `Deleted Job Payment ${this.uuid}`);
    return response;
  },
};
