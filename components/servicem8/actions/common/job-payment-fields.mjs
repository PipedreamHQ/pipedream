import { optionalBool01 } from "../../common/payload.mjs";
import { allOptional } from "../../common/action-schema.mjs";

export const jobPaymentCreateFields = [
  {
    prop: "jobUuid",
    api: "job_uuid",
    propDefinition: "jobUuid",
  },
  {
    prop: "paymentAmount",
    api: "payment_amount",
    type: "string",
    label: "Payment Amount",
    optional: true,
  },
  {
    prop: "paymentDate",
    api: "payment_date",
    type: "string",
    label: "Payment Date",
    optional: true,
    description: "e.g. ISO date string accepted by ServiceM8",
  },
  {
    prop: "paymentMethod",
    api: "payment_method",
    type: "string",
    label: "Payment Method",
    optional: true,
  },
  {
    prop: "paymentNote",
    api: "payment_note",
    type: "string",
    label: "Payment Note",
    optional: true,
  },
  {
    prop: "paymentReceived",
    api: "payment_received",
    type: "boolean",
    label: "Payment Received",
    optional: true,
    transform: optionalBool01,
  },
];

export const jobPaymentUpdateFields = allOptional(jobPaymentCreateFields);
