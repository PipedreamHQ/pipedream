import servicem8 from "../../servicem8.app.mjs";
import { optionalParsedInt } from "../../common/payload.mjs";

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
      description: "Job record to load, merge, and save (search or paste UUID).",
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
      description:
        "Client/company record for this job (billing and contact relationship).",
    },
    jobAddress: {
      type: "string",
      label: "Job Address",
      optional: true,
      description: "Work site address (max 500 characters); used for geocoding and maps.",
    },
    billingAddress: {
      type: "string",
      label: "Billing Address",
      optional: true,
      description: "Where to send invoices; defaults to job address if omitted (max 500).",
    },
    status: {
      type: "string",
      label: "Status",
      optional: true,
      description: "Controls dispatch board placement (max 20 characters).",
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
    date: {
      type: "string",
      label: "Date",
      optional: true,
      description: "Job created or scheduled date (reporting / chronology).",
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
      description: "Job category (type of work / department).",
    },
    lng: {
      type: "string",
      label: "Longitude",
      optional: true,
      description: "Usually auto-filled from geocoding the job address.",
    },
    lat: {
      type: "string",
      label: "Latitude",
      optional: true,
      description: "Usually auto-filled from geocoding the job address.",
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      optional: true,
      description: "Not used on Job; use the JobPayment endpoint.",
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
      description: "Not used on Job; use the JobPayment endpoint.",
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      optional: true,
      description: "Not used on Job; use the JobPayment endpoint.",
    },
    paymentAmount: {
      type: "string",
      label: "Payment Amount",
      optional: true,
      description: "Not used on Job; use the JobPayment endpoint.",
    },
    paymentNote: {
      type: "string",
      label: "Payment Note",
      optional: true,
      description: "Not used on Job; use the JobPayment endpoint.",
    },
    geoIsValid: {
      type: "string",
      label: "Geo Is Valid",
      optional: true,
      description: "Whether geocoding for the job address succeeded.",
    },
    purchaseOrderNumber: {
      type: "string",
      label: "Purchase Order Number",
      optional: true,
      description: "Client PO reference (max 100 characters).",
    },
    invoiceSent: {
      type: "string",
      label: "Invoice Sent",
      optional: true,
      description: "0 or 1 — whether an invoice has been sent.",
    },
    invoiceSentStamp: {
      type: "string",
      label: "Invoice Sent Timestamp",
      optional: true,
      description: "When the invoice was sent (`YYYY-MM-DD HH:MM:SS`).",
    },
    readyToInvoice: {
      type: "string",
      label: "Ready To Invoice",
      optional: true,
      description: "Deprecated in the API.",
    },
    readyToInvoiceStamp: {
      type: "string",
      label: "Ready To Invoice Timestamp",
      optional: true,
      description: "Deprecated in the API.",
    },
    geoCountry: {
      type: "string",
      label: "Geo Country",
      optional: true,
      description: "Country from geocoded address.",
    },
    geoPostcode: {
      type: "string",
      label: "Geo Postcode",
      optional: true,
      description: "Postal code from geocoded address.",
    },
    geoState: {
      type: "string",
      label: "Geo State",
      optional: true,
      description: "State/province from geocoded address.",
    },
    geoCity: {
      type: "string",
      label: "Geo City",
      optional: true,
      description: "City from geocoded address.",
    },
    geoStreet: {
      type: "string",
      label: "Geo Street",
      optional: true,
      description: "Street name from geocoded address.",
    },
    geoNumber: {
      type: "string",
      label: "Geo Street Number",
      optional: true,
      description: "Street number from geocoded address.",
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
      type: "string",
      label: "Badges",
      optional: true,
      description: "JSON array of badge UUIDs as a string.",
    },
    quoteDate: {
      type: "string",
      label: "Quote Date",
      optional: true,
      description: "When status became Quote.",
    },
    quoteSent: {
      type: "string",
      label: "Quote Sent",
      optional: true,
      description: "0 or 1 — whether a quote was sent.",
    },
    quoteSentStamp: {
      type: "string",
      label: "Quote Sent Timestamp",
      optional: true,
      description: "When the quote was sent (`YYYY-MM-DD HH:MM:SS`).",
    },
    workOrderDate: {
      type: "string",
      label: "Work Order Date",
      optional: true,
      description: "When status became Work Order.",
    },
    activeNetworkRequestUuid: {
      type: "string",
      label: "Active Network Request UUID",
      optional: true,
      description: "Deprecated in the API.",
    },
    relatedKnowledgeArticles: {
      type: "string",
      label: "Related Knowledge Articles",
      optional: true,
      description: "Deprecated in the API.",
    },
    jobDescription: {
      type: "string",
      label: "Job Description",
      optional: true,
      description: "Longer description of the job scope or work requested.",
    },
    workDoneDescription: {
      type: "string",
      label: "Work Done Description",
      optional: true,
      description: "Description of work completed.",
    },
    paymentProcessed: {
      type: "string",
      label: "Payment Processed",
      optional: true,
      description: "0 or 1 — exported to the connected accounting package.",
    },
    paymentReceived: {
      type: "string",
      label: "Payment Received",
      optional: true,
      description: "0 or 1 — full payment received for the job.",
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
    const response = await this.servicem8.updateJob({
      $,
      uuid: this.uuid,
      data: {
        company_uuid: this.companyUuid,
        job_address: this.jobAddress,
        billing_address: this.billingAddress,
        status: this.status,
        created_by_staff_uuid: this.createdByStaffUuid,
        date: this.date,
        category_uuid: this.categoryUuid,
        lng: this.lng,
        lat: this.lat,
        payment_date: this.paymentDate,
        payment_actioned_by_uuid: this.paymentActionedByUuid,
        payment_method: this.paymentMethod,
        payment_amount: this.paymentAmount,
        payment_note: this.paymentNote,
        geo_is_valid: this.geoIsValid,
        purchase_order_number: this.purchaseOrderNumber,
        invoice_sent: optionalParsedInt(this.invoiceSent),
        invoice_sent_stamp: this.invoiceSentStamp,
        ready_to_invoice: this.readyToInvoice,
        ready_to_invoice_stamp: this.readyToInvoiceStamp,
        geo_country: this.geoCountry,
        geo_postcode: this.geoPostcode,
        geo_state: this.geoState,
        geo_city: this.geoCity,
        geo_street: this.geoStreet,
        geo_number: this.geoNumber,
        queue_uuid: this.queueUuid,
        queue_expiry_date: this.queueExpiryDate,
        queue_assigned_staff_uuid: this.queueAssignedStaffUuid,
        badges: this.badges,
        quote_date: this.quoteDate,
        quote_sent: optionalParsedInt(this.quoteSent),
        quote_sent_stamp: this.quoteSentStamp,
        work_order_date: this.workOrderDate,
        active_network_request_uuid: this.activeNetworkRequestUuid,
        related_knowledge_articles: this.relatedKnowledgeArticles,
        job_description: this.jobDescription,
        work_done_description: this.workDoneDescription,
        payment_processed: optionalParsedInt(this.paymentProcessed),
        payment_received: optionalParsedInt(this.paymentReceived),
        completion_date: this.completionDate,
        unsuccessful_date: this.unsuccessfulDate,
      },
    });
    $.export("$summary", `Updated Job ${this.uuid}`);
    return response;
  },
};
