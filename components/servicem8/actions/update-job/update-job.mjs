import servicem8 from "../../servicem8.app.mjs";
import { optionalBool01 } from "../../common/payload.mjs";

const JOB_STATUS_OPTIONS = [
  "Quote",
  "Work Order",
  "Unsuccessful",
  "Completed",
];

export default {
  key: "servicem8-update-job",
  name: "Update Job",
  description: "Update a job (loads the record, merges your fields, then POSTs). [See the documentation](https://developer.servicem8.com/reference/updatejobs)",
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
          resource: "job",
          prevContext,
          query,
        });
      },
      label: "Job to update",
      description: "Job to load, merge, and save (search or paste UUID).",
    },
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
      optional: true,
      description: "Client/company for this job.",
    },
    jobAddress: {
      type: "string",
      label: "Job Address",
      optional: true,
      description: "Work site address (max 500 characters).",
    },
    billingAddress: {
      type: "string",
      label: "Billing Address",
      optional: true,
      description: "Invoice address (max 500).",
    },
    status: {
      type: "string",
      label: "Status",
      optional: true,
      description: "Job status (max 20 characters).",
      options: JOB_STATUS_OPTIONS,
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
      description: "Staff member who created the job.",
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
      description: "Job category.",
    },
    purchaseOrderNumber: {
      type: "string",
      label: "Purchase Order Number",
      optional: true,
      description: "Client PO reference (max 100 characters).",
    },
    invoiceSent: {
      type: "boolean",
      label: "Invoice Sent",
      optional: true,
      description: "Whether an invoice has been sent (sent as 0 or 1).",
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
      description: "Queue this job belongs to.",
    },
    queueExpiryDate: {
      type: "string",
      label: "Queue Expiry Date",
      optional: true,
      description: "When the job expires from the queue.",
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
      description: "Staff assigned to this job in the queue.",
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
        "Badge UUIDs ([list badges](https://developer.servicem8.com/reference/listbadges)). Sent as a JSON array string.",
    },
    quoteDate: {
      type: "string",
      label: "Quote Date",
      optional: true,
      description: "When status became Quote.",
    },
    quoteSent: {
      type: "boolean",
      label: "Quote Sent",
      optional: true,
      description: "Whether a quote was sent (0 or 1).",
    },
    workOrderDate: {
      type: "string",
      label: "Work Order Date",
      optional: true,
      description: "When status became Work Order.",
    },
    jobDescription: {
      type: "string",
      label: "Job Description",
      optional: true,
      description: "Scope or work requested.",
    },
    workDoneDescription: {
      type: "string",
      label: "Work Done Description",
      optional: true,
      description: "Description of work completed.",
    },
    paymentProcessed: {
      type: "boolean",
      label: "Payment Processed",
      optional: true,
      description: "Exported to accounting (0 or 1).",
    },
    paymentReceived: {
      type: "boolean",
      label: "Payment Received",
      optional: true,
      description: "Full payment received (0 or 1).",
    },
    completionDate: {
      type: "string",
      label: "Completion Date",
      optional: true,
      description: "When status became Completed.",
    },
    unsuccessfulDate: {
      type: "string",
      label: "Unsuccessful Date",
      optional: true,
      description: "When status became Unsuccessful.",
    },
  },
  async run({ $ }) {
    const badgesForApi = (() => {
      const b = this.badges;
      if (b === undefined || b === null) {
        return undefined;
      }
      if (Array.isArray(b)) {
        return b.length
          ? JSON.stringify(b)
          : undefined;
      }
      if (typeof b === "string" && b.trim() !== "") {
        return b.trim();
      }
      return undefined;
    })();
    const response = await this.servicem8.updateJob({
      $,
      uuid: this.uuid,
      data: {
        company_uuid: this.companyUuid,
        job_address: this.jobAddress,
        billing_address: this.billingAddress,
        status: this.status,
        created_by_staff_uuid: this.createdByStaffUuid,
        category_uuid: this.categoryUuid,
        purchase_order_number: this.purchaseOrderNumber,
        invoice_sent: optionalBool01(this.invoiceSent),
        queue_uuid: this.queueUuid,
        queue_expiry_date: this.queueExpiryDate,
        queue_assigned_staff_uuid: this.queueAssignedStaffUuid,
        badges: badgesForApi,
        quote_date: this.quoteDate,
        quote_sent: optionalBool01(this.quoteSent),
        work_order_date: this.workOrderDate,
        job_description: this.jobDescription,
        work_done_description: this.workDoneDescription,
        payment_processed: optionalBool01(this.paymentProcessed),
        payment_received: optionalBool01(this.paymentReceived),
        completion_date: this.completionDate,
        unsuccessful_date: this.unsuccessfulDate,
      },
    });
    $.export("$summary", `Updated Job ${this.uuid}`);
    return response;
  },
};
