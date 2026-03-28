import servicem8 from "../../servicem8.app.mjs";

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
    servicem8,
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
      description:
        "UUID linking to a stored attachment related to this payment, such as a receipt image. Optional reference to an Attachment record (`attachment_uuid`).",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createJobPayment({
      $,
      data: {
        job_uuid: this.jobUuid,
        actioned_by_uuid: this.actionedByUuid,
        amount: this.amount,
        method: this.method,
        note: this.note,
        attachment_uuid: this.attachmentUuid,
      },
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
