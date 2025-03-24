export const PAYMENT_MODE_OPTIONS = [
  "check",
  "cash",
  "creditcard",
  "banktransfer",
  "bankremittance",
  "autotransaction",
  "others",
];

export const PLACE_OF_SUPPLY_OPTIONS = [
  {
    label: "Abu Dhabi (UAE Supported)",
    value: "AB",
  },
  {
    label: "Ajman (UAE Supported)",
    value: "AJ",
  },
  {
    label: "Dubai (UAE Supported)",
    value: "DU",
  },
  {
    label: "Fujairah (UAE Supported)",
    value: "FU",
  },
  {
    label: "Ras al-Khaimah (UAE Supported)",
    value: "RA",
  },
  {
    label: "Sharjah (UAE Supported)",
    value: "SH",
  },
  {
    label: "Umm al-Quwain (UAE Supported)",
    value: "UM",
  },
  {
    label: "United Arab Emirates (GCC Supported)",
    value: "AE",
  },
  {
    label: "Saudi Arabia (GCC Supported)",
    value: "SA",
  },
  {
    label: "Bahrain (GCC Supported)",
    value: "BH",
  },
  {
    label: "Kuwait (GCC Supported)",
    value: "KW",
  },
  {
    label: "Oman (GCC Supported)",
    value: "OM",
  },
  {
    label: "Qatar (GCC Supported)",
    value: "QA",
  },
];

export const GST_TREATMENT_OPTIONS = [
  "business_gst",
  "business_none",
  "overseas",
  "consumer",
];

export const DISCOUNT_TYPE_OPTIONS = [
  "entity_level",
  "item_level",
];

export const PRODUCT_TYPE_OPTIONS = [
  "goods",
  "service",
  "digital_service",
];

export const ITEM_TYPE_OPTIONS = [
  "sales",
  "purchases",
  "sales_and_purchases",
  "inventory",
];

export const TAX_TREATMENT_OPTIONS = [
  "vat_registered",
  "vat_not_registered",
  "gcc_vat_not_registered",
  "gcc_vat_registered",
  "non_gcc",
  "dz_vat_registered",
  "dz_vat_not_registered",
  "home_country_mexico",
  "border_region_mexico",
  "non_mexico",
  "vat_registered ",
  "vat_not_registered ",
  "non_kenya",
  "vat_registered",
  "vat_not_registered",
  "overseas",
];

export const PRINT_OPTIONS = [
  "true",
  "false",
  "on",
  "off",
];

export const STATUS_OPTIONS = [
  "unbilled",
  "invoiced",
  "reimbursed",
  "non-billable",
  "billable",
];

export const SORT_COLUMN_OPTIONS = [
  "date",
  "account_name",
  "total",
  "bcy_total",
  "reference_number",
  "customer_name",
  "created_time",
];

export const FILTER_BY_OPTIONS = [
  "Status.All",
  "Status.Billable",
  "Status.Nonbillable",
  "Status.Reimbursed",
  "Status.Invoiced",
  "Status.Unbilled",
];

export const INVOICE_STATUS_OPTIONS = [
  "sent",
  "draft",
  "overdue",
  "paid",
  "void",
  "unpaid",
  "partially_paid",
  "viewed",
];

export const INVOICE_FILTER_BY_OPTIONS = [
  "Status.All",
  "Status.Sent",
  "Status.Draft",
  "Status.OverDue",
  "Status.Paid",
  "Status.Void",
  "Status.Unpaid",
  "Status.PartiallyPaid",
  "Status.Viewed",
  "Date.PaymentExpectedDate",
];

export const INVOICE_SORT_COLUMN_OPTIONS = [
  "customer_name",
  "invoice_number",
  "date",
  "due_date",
  "total",
  "balance",
  "created_time",
];

export const LANGUAGE_CODE_OPTIONS = [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "ja",
  "nl",
  "pt",
  "pt_br",
  "sv",
  "zh",
  "en_gb",
];

export const CUSTOMER_SUB_TYPE_OPTIONS = [
  "business",
  "individual",
];
