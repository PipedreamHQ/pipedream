export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  return obj;
};

const DOCUMENT_TYPE_OPTIONS = [
  {
    label: "Invoice",
    value: "invoice",
  },
  {
    label: "Proforma",
    value: "proforma",
  },
  {
    label: "Legacy partial proforma (cannot be set for new documents)",
    value: "partial_proforma",
  },
  {
    label: "Correction document for an invoice",
    value: "correction",
  },
  {
    label: "Tax document for a received payment",
    value: "tax_document",
  },
  {
    label: "Final invoice for tax documents",
    value: "final_invoice",
  },
];

const PROFORMA_OPTIONS = [
  {
    label: "Invoice paid",
    value: "final_invoice_paid",
  },
  {
    label: "Invoice with edit",
    value: "final_invoice",
  },
  {
    label: "Document to payment",
    value: "tax_document",
  },
  {
    label: "None",
    value: "none",
  },
];

const ACTION_OPTIONS = [
  {
    label: "Cancel",
    value: "cancel",
  },
  {
    label: "Uncancel",
    value: "undo_cancel",
  },
];

const ACTION_TYPE_OPTIONS = [
  {
    label: "Execute Payment",
    value: "execute",
  },
  {
    label: "Remove Payment",
    value: "remove",
  },
];

const EVENT_OPTIONS = [
  {
    label: "Invoice was updated",
    value: "invoice_updated",
  },
  {
    label: "Invoice was deleted and moved to the trash",
    value: "invoice_removed",
  },
  {
    label: "Invoice was restored from the trash",
    value: "invoice_restored",
  },
  {
    label: "Invoice was marked as overdue",
    value: "invoice_overdue",
  },
  {
    label: "Payment was added to document and marked it as paid",
    value: "invoice_paid",
  },
  {
    label: "Payment was added to the invoice, but didn't mark it as paid",
    value: "invoice_payment_added",
  },
  {
    label: "Invoice was marked as unpaid, and the payments in the additional payload were removed",
    value: "invoice_payment_removed",
  },
  {
    label: "Email with the invoice was sent to the subject",
    value: "invoice_sent",
  },
  {
    label: "Invoice was locked",
    value: "invoice_locked",
  },
  {
    label: "Invoice was unlocked",
    value: "invoice_unlocked",
  },
  {
    label: "Invoice was marked as cancelled",
    value: "invoice_cancelled",
  },
  {
    label: "Cancellation was removed",
    value: "invoice_cancellation_removed",
  },
  {
    label: "Invoice was marked as uncollectible",
    value: "invoice_uncollectible",
  },
  {
    label: "Uncollectibility was removed",
    value: "invoice_uncollectible_removed",
  },
];

export default {
  DOCUMENT_TYPE_OPTIONS,
  PROFORMA_OPTIONS,
  ACTION_OPTIONS,
  ACTION_TYPE_OPTIONS,
  EVENT_OPTIONS,
};
