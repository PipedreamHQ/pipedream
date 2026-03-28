import servicem8 from "../../servicem8.app.mjs";
import { YES_NO_10_OPTIONS } from "../../common/logic.mjs";
import { badgesJsonArrayForApi } from "../../common/payload.mjs";

const JOB_STATUS_OPTIONS = [
  "Quote",
  "Work Order",
  "Unsuccessful",
  "Completed",
];

export default {
  key: "servicem8-create-job",
  name: "Create Job",
  description: "Create a job. [See the documentation](https://developer.servicem8.com/reference/createjobs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    servicem8,
    companyUuid: {
      type: "string",
      label: "Company",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "company",
          prevContext,
          query,
        });
      },
      description:
        "Client/company for this job (billing and contact relationship).",
    },
    createdByStaffUuid: {
      type: "string",
      label: "Created by staff",
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
      description: "Staff member who created the job (`created_by_staff_uuid`).",
    },
    date: {
      type: "string",
      label: "Date",
      optional: true,
      description: "Job date (`date`); format as accepted by the API (e.g. `YYYY-MM-DD HH:MM:SS`).",
    },
    billingAddress: {
      type: "string",
      label: "Billing Address",
      optional: true,
      description: "Invoice address (`billing_address`; max 500).",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Initial job status (`status`; max 20 characters).",
      options: JOB_STATUS_OPTIONS,
    },
    paymentDate: {
      type: "string",
      label: "Payment date",
      optional: true,
      description: "Payment date (`payment_date`).",
    },
    paymentActionedByUuid: {
      type: "string",
      label: "Payment actioned by",
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
      description: "Staff member (`payment_actioned_by_uuid`).",
    },
    paymentMethod: {
      type: "string",
      label: "Payment method",
      optional: true,
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._paymentMethodOptionsFromJobPayments({
          $: $ ?? this,
          prevContext,
          query,
        });
      },
      description:
        "Payment method (`payment_method`). Options are distinct `method` values from [job payments](https://developer.servicem8.com/reference/listjobpayments); paste a value if yours is not listed.",
    },
    paymentAmount: {
      type: "string",
      label: "Payment amount",
      optional: true,
      description: "Payment amount (`payment_amount`) in the account currency.",
    },
    categoryUuid: {
      type: "string",
      label: "Category",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "category",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Job category (`category_uuid`).",
    },
    purchaseOrderNumber: {
      type: "string",
      label: "Purchase Order Number",
      optional: true,
      description: "Client PO reference (`purchase_order_number`; max 100 characters).",
    },
    invoiceSent: {
      type: "string",
      label: "Invoice sent",
      optional: true,
      description: "Whether an invoice has been sent (`invoice_sent`).",
      options: YES_NO_10_OPTIONS,
    },
    queueUuid: {
      type: "string",
      label: "Queue",
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "queue",
          prevContext,
          query,
        });
      },
      optional: true,
      description: "Queue this job belongs to (`queue_uuid`).",
    },
    queueAssignedStaffUuid: {
      type: "string",
      label: "Queue assigned staff",
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
      description: "Staff assigned to this job in the queue (`queue_assigned_staff_uuid`).",
    },
    badges: {
      type: "string[]",
      label: "Badges",
      optional: true,
      useQuery: true,
      async options({
        $, prevContext, query,
      }) {
        return this.servicem8._uuidOptionsForResource({
          $: $ ?? this,
          resource: "badge",
          prevContext,
          query,
        });
      },
      description:
        "Badge UUIDs ([list badges](https://developer.servicem8.com/reference/listbadges)). Sent as a JSON array string for the API.",
    },
    jobAddress: {
      type: "string",
      label: "Job Address",
      description: "Work site address (`job_address`; max 500 characters).",
    },
    jobDescription: {
      type: "string",
      label: "Job Description",
      optional: true,
      description: "Scope or work requested (`job_description`).",
    },
    workDoneDescription: {
      type: "string",
      label: "Work done description",
      optional: true,
      description: "Description of work completed (`work_done_description`).",
    },
    paymentProcessed: {
      type: "string",
      label: "Payment processed",
      optional: true,
      description: "Exported to accounting (`payment_processed`).",
      options: YES_NO_10_OPTIONS,
    },
    paymentReceived: {
      type: "string",
      label: "Payment received",
      optional: true,
      description: "Full payment received (`payment_received`).",
      options: YES_NO_10_OPTIONS,
    },
    completionDate: {
      type: "string",
      label: "Completion date",
      optional: true,
      description: "When status became Completed (`completion_date`).",
    },
    unsuccessfulDate: {
      type: "string",
      label: "Unsuccessful date",
      optional: true,
      description: "When status became Unsuccessful (`unsuccessful_date`).",
    },
    note: {
      type: "string",
      label: "Note",
      optional: true,
      description:
        "Optional diary note (creates a Note linked to the new job after create).",
    },
  },
  async run({ $ }) {
    const {
      body, recordUuid,
    } = await this.servicem8.createJob({
      $,
      data: {
        company_uuid: this.companyUuid,
        created_by_staff_uuid: this.createdByStaffUuid,
        date: this.date,
        billing_address: this.billingAddress,
        status: this.status,
        payment_date: this.paymentDate,
        payment_actioned_by_uuid: this.paymentActionedByUuid,
        payment_method: this.paymentMethod,
        payment_amount: this.paymentAmount,
        category_uuid: this.categoryUuid,
        purchase_order_number: this.purchaseOrderNumber,
        invoice_sent: this.invoiceSent,
        queue_uuid: this.queueUuid,
        queue_assigned_staff_uuid: this.queueAssignedStaffUuid,
        badges: badgesJsonArrayForApi(this.badges),
        job_address: this.jobAddress,
        job_description: this.jobDescription,
        work_done_description: this.workDoneDescription,
        payment_processed: this.paymentProcessed,
        payment_received: this.paymentReceived,
        completion_date: this.completionDate,
        unsuccessful_date: this.unsuccessfulDate,
      },
    });
    let noteRecordUuid;
    if (
      recordUuid &&
      this.note != null &&
      String(this.note).trim() !== ""
    ) {
      const noteRes = await this.servicem8.createNote({
        $,
        data: {
          related_object: "job",
          related_object_uuid: recordUuid,
          note: String(this.note).trim(),
        },
      });
      noteRecordUuid = noteRes.recordUuid;
    }
    $.export(
      "$summary",
      `Created Job${recordUuid
        ? ` (${recordUuid})`
        : ""}${noteRecordUuid
        ? `; diary note (${noteRecordUuid})`
        : ""}`,
    );
    return {
      body,
      recordUuid,
      ...(noteRecordUuid && {
        noteRecordUuid,
      }),
    };
  },
};
