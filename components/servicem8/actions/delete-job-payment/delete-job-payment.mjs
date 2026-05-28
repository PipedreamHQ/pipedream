import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-delete-job-payment",
  name: "Delete Job Payment",
  description: "Delete a job payment by UUID. [See the documentation](https://developer.servicem8.com/reference/deletejobpayments)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      label: "Job payment",
      description: "Select the job payment to delete (search or paste UUID).",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "jobpayment",
          prevContext,
          query,
        });
      },
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
