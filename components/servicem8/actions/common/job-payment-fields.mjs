import { allOptional } from "../../common/action-schema.mjs";

/**
 * ServiceM8 job payment create/update body fields.
 * Aligned with [Create job payments](https://developer.servicem8.com/reference/createjobpayments)
 * and [Update job payments](https://developer.servicem8.com/reference/updatejobpayments).
 */
export const jobPaymentCreateFields = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
    description: "Job this payment belongs to.",
  },
  {
    prop: "actionedByUuid",
    api: "actioned_by_uuid",
    propDefinition: "staffUuid",
    optional: true,
    description: "Staff member who recorded or processed this payment.",
  },
  {
    prop: "timestamp",
    api: "timestamp",
    type: "string",
    label: "Timestamp",
    optional: true,
    description: "When the payment was recorded (`YYYY-MM-DD HH:MM:SS`).",
  },
  {
    prop: "amount",
    api: "amount",
    type: "string",
    label: "Amount",
    optional: true,
    description: "Payment amount in the account currency.",
  },
  {
    prop: "method",
    api: "method",
    type: "string",
    label: "Method",
    optional: true,
    description: "e.g. Cash, Credit Card, Bank Transfer, Stripe",
  },
  {
    prop: "note",
    api: "note",
    type: "string",
    label: "Note",
    optional: true,
    description: "Reference numbers, transaction IDs, or other details.",
  },
  {
    prop: "attachmentUuid",
    api: "attachment_uuid",
    propDefinition: "dboattachmentUuid",
    optional: true,
    description: "Optional attachment (e.g. receipt) linked to this payment.",
  },
];

export const jobPaymentUpdateFields = allOptional(jobPaymentCreateFields);
