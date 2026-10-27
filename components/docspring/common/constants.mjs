// Keep in step with package.json's "version": DocSpring counts the integration's users by
// this User-Agent, and Pipedream bumps the package with every component change.
const PACKAGE_VERSION = "0.0.1";
const USER_AGENT = `docspring-pipedream/${PACKAGE_VERSION}`;

const API_PATH = "/api/v2";

const HOSTS = {
  us: {
    standard: "api.docspring.com",
    sync: "sync.api.docspring.com",
  },
  eu: {
    standard: "api-eu.docspring.com",
    sync: "sync.api-eu.docspring.com",
  },
};

// Most items a list request returns, and most options a dropdown loads.
const MAX_PAGE_SIZE = 100;
const MAX_PICKER_OPTIONS = 1000;
const DEFAULT_MAX_RESULTS = 50;

// The most seconds one request waits in total for Retry-After after 429s before failing, so
// the step stays inside Pipedream's default 30-second timeout.
const MAX_RATE_LIMIT_WAIT_SECONDS = 20;

// Largest PDF DocSpring takes as base64; a larger one needs a public https:// URL.
const MAX_BASE64_DOCUMENT_BYTES = 7 * 1024 * 1024;

const SUBMISSION_FAILURE_STATES = [
  "error",
  "syntax_error",
  "image_download_failed",
  "image_processing_failed",
];

const TEMPLATE_DOCUMENT_FAILURE_STATES = [
  "password_required",
  "malformed_pdf",
  "unknown_error",
  "download_failed",
];

const OUTPUT_FORMAT_OPTIONS = [
  {
    label: "PDF",
    value: "pdf",
  },
  {
    label: "PNG page images",
    value: "png",
  },
];

const SOURCE_PDF_TYPES = [
  "submission",
  "combined_pdf",
  "template",
  "custom_file",
  "url",
];

const AUTH_TYPE_OPTIONS = [
  {
    label: "Email link (you emailed them the link)",
    value: "email_link",
  },
  {
    label: "Password (they signed in to your app)",
    value: "password",
  },
  {
    label: "OAuth (they signed in with a provider such as Google)",
    value: "oauth",
  },
  {
    label: "Phone number",
    value: "phone_number",
  },
  {
    label: "LDAP",
    value: "ldap",
  },
  {
    label: "SAML",
    value: "saml",
  },
];

const SIGNING_LINK_TYPE_OPTIONS = [
  {
    label: "Email (opens the form for 7 days)",
    value: "email",
  },
  {
    label: "API (opens the form for 24 hours)",
    value: "api",
  },
];

// Every version 4 webhook event except webhook.*.
const EVENT_TYPE_OPTIONS = [
  {
    label: "Submission Created",
    value: "submission.created",
  },
  {
    label: "Submission Processed",
    value: "submission.processed",
  },
  {
    label: "Submission Failed",
    value: "submission.failed",
  },
  {
    label: "Submission Declined",
    value: "submission.declined",
  },
  {
    label: "Submission Updated",
    value: "submission.updated",
  },
  {
    label: "Submission Expired",
    value: "submission.expired",
  },
  {
    label: "Signature Request Viewed",
    value: "signature_request.viewed",
  },
  {
    label: "Signature Request Completed",
    value: "signature_request.completed",
  },
  {
    label: "Signature Request Declined",
    value: "signature_request.declined",
  },
  {
    label: "Signature Request Updated",
    value: "signature_request.updated",
  },
  {
    label: "Combined PDF Processed",
    value: "combined_pdf.processed",
  },
  {
    label: "Combined PDF Failed",
    value: "combined_pdf.failed",
  },
  {
    label: "Combined PDF Expired",
    value: "combined_pdf.expired",
  },
  {
    label: "Submission Batch Processed",
    value: "submission_batch.processed",
  },
  {
    label: "Submission Batch Failed",
    value: "submission_batch.failed",
  },
  {
    label: "Template Created",
    value: "template.created",
  },
  {
    label: "Template Updated",
    value: "template.updated",
  },
  {
    label: "Template Deleted",
    value: "template.deleted",
  },
  {
    label: "Custom File Created",
    value: "custom_file.created",
  },
  {
    label: "Folder Created",
    value: "folder.created",
  },
  {
    label: "Folder Updated",
    value: "folder.updated",
  },
  {
    label: "Folder Deleted",
    value: "folder.deleted",
  },
];

// The events a webhook's template filter applies to, by the part of the event type before the
// dot. DocSpring rejects a webhook with templates and any other event.
const TEMPLATE_FILTERABLE_RESOURCES = [
  "submission",
  "signature_request",
  "template",
];

// Where a 504 polling_timeout or a failed record points the user, by the ID key in the error.
const RECORD_KINDS = {
  submission_id: {
    noun: "Submission",
    getAction: "Get Submission",
    event: "submission.processed",
  },
  combined_pdf_id: {
    noun: "Combined PDF",
    getAction: "Get Combined PDF",
    event: "combined_pdf.processed",
  },
  submission_batch_id: {
    noun: "Submission batch",
    getAction: "Get Submission Batch",
    event: "submission_batch.processed",
  },
  template_id: {
    noun: "Template",
    getAction: "Get Template",
    event: null,
  },
};

export default {
  PACKAGE_VERSION,
  USER_AGENT,
  API_PATH,
  HOSTS,
  MAX_PAGE_SIZE,
  MAX_PICKER_OPTIONS,
  DEFAULT_MAX_RESULTS,
  MAX_RATE_LIMIT_WAIT_SECONDS,
  MAX_BASE64_DOCUMENT_BYTES,
  SUBMISSION_FAILURE_STATES,
  TEMPLATE_DOCUMENT_FAILURE_STATES,
  OUTPUT_FORMAT_OPTIONS,
  SOURCE_PDF_TYPES,
  AUTH_TYPE_OPTIONS,
  SIGNING_LINK_TYPE_OPTIONS,
  EVENT_TYPE_OPTIONS,
  TEMPLATE_FILTERABLE_RESOURCES,
  RECORD_KINDS,
};
