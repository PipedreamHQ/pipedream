import servicem8 from "../../servicem8.app.mjs";

export default {
  key: "servicem8-get-job-payment",
  name: "Get Job Payment",
  description: "Get a job payment by UUID. [See the documentation](https://developer.servicem8.com/reference/getjobpayments)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    servicem8,
    uuid: {
      type: "string",
      label: "Job payment",
      description: "Select the job payment to retrieve (search or paste UUID).",
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
    const response = await this.servicem8.getResource({
      $,
      resource: "jobpayment",
      uuid: this.uuid,
    });
    $.export("$summary", `Retrieved Job Payment ${this.uuid}`);
    return response;
  },
};
