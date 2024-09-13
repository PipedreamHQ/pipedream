const SALUTATION_OPTIONS = [
  "--None--",
  "Mr.",
  "Ms.",
  "Mrs.",
  "Dr.",
  "Prof.",
];

const INDUSTRY_OPTIONS = [
  "--None--",
  "Apparel",
  "Banking",
  "Education",
  "Electronics",
  "Finance",
  "Government",
  "Healthcare",
  "Hospitality",
  "Insurance",
  "Retail",
  "Technology",
  "Telecommunications",
  "Utilities",
  "Other",
];

const CONTACT_TYPE_OPTIONS = [
  "--None--",
  "Analyst",
  "Competitor",
  "Customer",
  "Integrator",
  "Investor",
  "Partner",
  "Press",
  "Prospect",
  "Reseller",
  "Other",
  "Media",
  "Suppliers",
  "Customers",
];

const LEAD_SOURCE_OPTIONS = [
  "--None--",
  "Cold Call",
  "Existing Customer",
  "Self Generated",
  "Employee",
  "Partner",
  "Public Relations",
  "Direct Mail",
  "Conference",
  "Trade Show",
  "Web Site",
  "Word of mouth",
  "Other",
];

const LEAD_STATUS_OPTIONS = [
  "--None--",
  "Attempted to Contact",
  "Cold",
  "Contact in Future",
  "Contacted",
  "Hot",
  "Junk Lead",
  "Lost Lead",
  "Not Contacted",
  "Pre Qualified",
  "Qualified",
  "Warm",
];

const RATING_OPTIONS = [
  "--None--",
  "Acquired",
  "Active",
  "Market Failed",
  "Project Cancelled",
  "Shutdown",
];

const BOOL_OPTIONS = [
  "Yes",
  "No",
];

const ASSIGNED_TO_OPTIONS = [
  "admin",
  "posuser",
];

const ASSIGNED_TO_GROUP_OPTIONS = [
  "Administrator",
  "Channel Management",
  "Finance",
  "Fulfillment",
  "Management",
  "Marketing",
  "Product Management",
  "Production",
  "Purchasing",
  "Retail Management",
  "Retail Sales",
  "Sales",
  "Sales Reps",
  "Support",
  "Warehouse Management",
];

const RECURRING_EVENT_OPTIONS = [
  "--None--",
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
];

const RELATED_TO_TYPE_OPTIONS = [
  "Leads",
  "Accounts",
  "Potentials",
  "Quotes",
  "Purchase Order",
  "Sales Order",
  "Invoice",
];

const STATUS_OPTIONS = [
  "Planned",
  "Held",
  "Not Held",
];

const ACTIVITY_TYPE_OPTIONS = [
  "Call",
  "Meeting",
];

const TYPE_FIELDS = {
  Leads: {
    item: "Leads",
    subItem: "Lead",
    names: [
      "FirstName",
      "LastName",
    ],
    filterField: "CreatedTime",
  },
  Accounts: {
    item: "Accounts",
    subItem: "Account",
    names: [
      "AccountName",
    ],
    filterField: "CreatedTime",
  },
  Quotes: {
    path: "Quote",
    item: "Quotes",
    subItem: "Quote",
    names: [
      "Subject",
    ],
    filterField: "OrderDate",
  },
  PurchaseOrder: {
    item: "POOrders",
    subItem: "Order",
    names: [
      "Subject",
    ],
    filterField: "OrderDate",
  },
  SalesOrder: {
    item: "Orders",
    subItem: "Order",
    names: [
      "Subject",
    ],
    filterField: "OrderDate",
  },
  Contacts: {
    item: "Contacts",
    subItem: "Contact",
  },
  Tasks: {
    item: "Tasks",
    subItem: "Task",
  },
};

export default {
  CONTACT_TYPE_OPTIONS,
  INDUSTRY_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  LEAD_STATUS_OPTIONS,
  SALUTATION_OPTIONS,
  RATING_OPTIONS,
  BOOL_OPTIONS,
  ASSIGNED_TO_OPTIONS,
  ASSIGNED_TO_GROUP_OPTIONS,
  RECURRING_EVENT_OPTIONS,
  RELATED_TO_TYPE_OPTIONS,
  STATUS_OPTIONS,
  ACTIVITY_TYPE_OPTIONS,
  TYPE_FIELDS,
};
