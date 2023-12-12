const DEFAULT_LIMIT = 25;

const CONTACT_TYPE_OPTIONS = [
  {
    value: "person",
    label: "Person",
  },
  {
    value: "company",
    label: "Company",
  },
];

const LEAD_TYPE_OPTIONS = [
  {
    value: "general",
    label: "General",
  },
  {
    value: "appraisal_request",
    label: "Appraisal Request",
  },
  {
    value: "listing_enquiry",
    label: "Listing Enquiry",
  },
];

const REMINDER_TYPE_OPTIONS = [
  {
    value: "phone",
    label: "Phone",
  },
  {
    value: "task",
    label: "Task",
  },
  {
    value: "sms",
    label: "SMS",
  },
  {
    value: "letter",
    label: "Letter",
  },
  {
    value: "email",
    label: "Email",
  },
];

const PRIORITY_OPTIONS = [
  {
    value: "high",
    label: "High",
  },
  {
    value: "default",
    label: "Default",
  },
  {
    value: "low",
    label: "Low",
  },
];

export default {
  DEFAULT_LIMIT,
  CONTACT_TYPE_OPTIONS,
  LEAD_TYPE_OPTIONS,
  REMINDER_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
};
