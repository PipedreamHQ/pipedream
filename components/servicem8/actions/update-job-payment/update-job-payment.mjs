import servicem8 from "../../servicem8.app.mjs";

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
    servicem8,
    uuid: {
      type: "string",
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
      label: "Job payment to update",
      description: "Payment record to load, merge, and save (search or paste UUID).",
    },
    jobUuid: {
      type: "string",
      label: "Job",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "job",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Job this payment belongs to.",
    },
    actionedByUuid: {
      type: "string",
      label: "Actioned by",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "staff",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Staff member who recorded this payment.",
    },
    amount: {
      type: "string",
      label: "Amount",
      optional: true,
      description: "Payment amount in the account currency.",
    },
    method: {
      type: "string",
      label: "Method",
      optional: true,
      description: "e.g. Cash, Credit Card, Bank Transfer, Stripe",
    },
    note: {
      type: "string",
      label: "Note",
      optional: true,
      description: "Reference numbers, transaction IDs, or other details.",
    },
    attachmentUuid: {
      type: "string",
      label: "Attachment",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "dboattachment",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Optional attachment (e.g. receipt) linked to this payment.",
    },
  },
  async run({ $ }) {
    const response = await this.servicem8.updateJobPayment({
      $,
      uuid: this.uuid,
      data: {
        job_uuid: this.jobUuid,
        actioned_by_uuid: this.actionedByUuid,
        amount: this.amount,
        method: this.method,
        note: this.note,
        attachment_uuid: this.attachmentUuid,
      },
    });
    $.export("$summary", `Updated Job Payment ${this.uuid}`);
    return response;
  },
};
