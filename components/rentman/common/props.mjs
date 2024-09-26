import {
  AVAILABILITY_STATUS_OPTIONS,
  COUNTRY_OPTIONS,
  PAYMENT_IMPORT_SOURCE_OPTIONS,
  RECURRENCE_UNIT_OPTIONS,
} from "../common/constants.mjs";

const contactId = {
  type: "string",
  label: "Contact Id",
  description: "The Id of the contact.",
  optional: true,
  options: async ({ page }) => this.rentman.asyncOpt({
    page,
    fn: this.rentman.listItems.bind(null, "contacts"),
  }),
};
const projectRequestId = {
  type: "string",
  label: "Project Request Id",
  description: "The id of the project request.",
  options: async ({ page }) => this.rentman.asyncOpt({
    page,
    fn: this.rentman.listItems.bind(null, "projectrequests"),
  }),
};
const custom = {
  type: "object",
  label: "Custom",
  description: "The object containing all custom defined fields.",
  optional: true,
};
const folder = {
  type: "string",
  label: "Folder",
  description: "The contact's folder.",
  options: async ({ page }) => this.rentman.asyncOpt({
    page,
    fn: this.rentman.listItems.bind(null, "folders"),
    returnType: "folders",
    filterFunction: ({ itemtype }) => itemtype === "contact",
  }),
};
const projectId = {
  type: "string",
  label: "Project Id",
  description: "The Id of the project.",
  options: async ({ page }) => this.rentman.asyncOpt({
    page,
    fn: this.rentman.listItems.bind(null, "projects"),
  }),
};
const subproject = {
  type: "string",
  label: "Subproject",
  description: "The cost's subproject.",
  options: async ({ page }) => this.rentman.asyncOpt({
    page,
    fn: this.rentman.listSubprojects,
    returnType: "subprojects",
  }),
};

export const ADDITIONAL_PROPS = {
  "appointments": {
    name: {
      type: "string",
      label: "Name",
      description: "The appointment name.",
      optional: true,
    },
    start: {
      type: "string",
      label: "Start",
      description: "The appointment start date-time. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
    },
    end: {
      type: "string",
      label: "End",
      description: "The appointment start date-time. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
    },
    color: {
      type: "string",
      label: "Color",
      description: "The appointment color.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The appointment location.",
      optional: true,
    },
    remark: {
      type: "string",
      label: "Remark",
      description: "The appointment description.",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Is Public",
      description: "Whether the appointment is public or private.",
      optional: true,
    },
    isPlannable: {
      type: "boolean",
      label: "Is Plannable",
      description: "If yes, employees can be scheduled during this appointment.",
      optional: true,
    },
  },
  "contactpersons": {
    contactId,
    firstname: {
      type: "string",
      label: "First Name",
      description: "The person's first name.",
      optional: true,
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "The person's middle name.",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The person's last name.",
      optional: true,
    },
    function: {
      type: "string",
      label: "Function",
      description: "The person's function.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The person's phone.",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The person's street address.",
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "The person's street address number.",
      optional: true,
    },
    postalcode: {
      type: "string",
      label: "Postal Code",
      description: "The person's address postal code.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The person's address city.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The person's address state.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The person's address country.",
      options: COUNTRY_OPTIONS,
      optional: true,
    },
    mobilephone: {
      type: "string",
      label: "Mobile Phone",
      description: "The person's mobile phone.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The person's email address.",
      optional: true,
    },
    custom,
  },
  "contacts": {
    folder,
    type: {
      type: "string",
      label: "type",
      description: "The contact's type.",
      options: [
        "private",
        "company",
      ],
      reloadProps: true,
    },
    extNameLine: {
      type: "string",
      label: "Ext Name Line",
      description: "The contact's extra name line.",
      optional: true,
    },
    distance: {
      type: "integer",
      label: "Distance",
      description: "Distance from warehouse to visiting address.",
      optional: true,
    },
    travelTime: {
      type: "integer",
      label: "Travel Time",
      description: "Travel time from warehouse to visiting address.",
      optional: true,
    },
    code: {
      type: "string",
      label: "Code",
      description: "Automatically generated if left empty.",
      optional: true,
    },
    accountingCode: {
      type: "string",
      label: "Accounting Code",
      description: "External identifier used for integrations with accounting software.",
      optional: true,
    },
    visitCity: {
      type: "string",
      label: "Visit City",
      description: "City (visiting address).",
      optional: true,
    },
    visitStreet: {
      type: "string",
      label: "Visit Street",
      description: "Street (visiting address).",
      optional: true,
    },
    visitNumber: {
      type: "string",
      label: "Visit Number",
      description: " House number (visiting address) .",
      optional: true,
    },
    visitPostalcode: {
      type: "string",
      label: "Visit Postal code",
      description: "Postal code (visiting address).",
      optional: true,
    },
    visitState: {
      type: "string",
      label: "Visit State",
      description: "State/Province (visiting address).",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country (visiting address).",
      options: COUNTRY_OPTIONS,
      optional: true,
    },
    phone_1: {
      type: "string",
      label: "Phone 1",
      description: "The contact's phone number.",
      optional: true,
    },
    phone_2: {
      type: "string",
      label: "Phone 2",
      description: "The contact's additional phone number.",
      optional: true,
    },
    email_1: {
      type: "string",
      label: "Email 1",
      description: "The contact's email address.",
      optional: true,
    },
    email_2: {
      type: "string",
      label: "Email 2",
      description: "The contact's additional email address.",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The contact's website.",
      optional: true,
    },
    custom,
  },
  "costs": {
    projectId,
    name: {
      type: "string",
      label: "Name",
      description: "The cost's name.",
      optional: true,
    },
    remark: {
      type: "string",
      label: "Name",
      description: "The cost's description.",
      optional: true,
    },
    subproject,
    taxclass: {
      type: "string",
      label: "Tax Class",
      description: "This class, in combination with the chosen VAT scheme at project level, determines the final VAT rate.",
      optional: true,
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "taxclasses"),
        returnType: "taxclasses",
      }),
    },
    ledger: {
      type: "string",
      label: "Ledger",
      description: "The cost's ledger code.",
      optional: true,
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "ledgercodes"),
        returnType: "ledgercodes",
      }),
    },
    verkoopprijs: {
      type: "integer",
      label: "Sale Price",
      description: "The cost's sale price.",
      optional: true,
    },
    inkoopprijs: {
      type: "integer",
      label: "Purchase Price",
      description: "The cost's purchase price.",
      optional: true,
    },
    custom,
  },
  "crewavailability": {
    crewId: {
      type: "string",
      label: "Crew Id",
      description: "The crew Id.",
      optional: true,
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "crew"),
      }),
    },
    start: {
      type: "string",
      label: "Start",
      description: "The availability's start date-time. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "The availability's end date-time. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The availability's status.",
      options: AVAILABILITY_STATUS_OPTIONS,
      optional: true,
    },
    remark: {
      type: "string",
      label: "Remark",
      description: "The availability's description.",
      optional: true,
    },
    recurrenceIntervalUnit: {
      type: "string",
      label: "Recurrence Interval Unit",
      description: "The type od the recurrence",
      options: RECURRENCE_UNIT_OPTIONS,
      optional: true,
    },
    recurrenceEnddate: {
      type: "string",
      label: "Recurrence End Date",
      description: "The date-time when the occuence will finish. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
      optional: true,
    },
    recurrenceInterval: {
      type: "integer",
      label: "Recurrence Interval",
      description: "interval in how many days/weeks/months/years the availability should reoccur.",
      optional: true,
    },
  },
  "payments": {
    invoiceId: {
      type: "string",
      label: "Invoice Id",
      description: "The id of the invoice.",
      optional: true,
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "invoices"),
      }),
    },
    moment: {
      type: "string",
      label: "Moment",
      description: "The payment's date-time. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The payment amount.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The payment's description.",
      optional: true,
    },
    paymentImportSource: {
      type: "string",
      label: "Payment Import Source",
      description: "Accounting software this payment was imported from.",
      options: PAYMENT_IMPORT_SOURCE_OPTIONS,
      optional: true,
    },
  },
  "projectrequestequipment": {
    projectRequestId,
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "The quantity of equipment of the request.",
      optional: true,
    },
    quantityTotal: {
      type: "integer",
      label: "Quantity Total",
      description: "The total quantity of equipment of the request.",
      optional: true,
    },
    isComment: {
      type: "boolean",
      label: "Is Comment",
      description: "Whether the request is a comment or not.",
      optional: true,
    },
    isKit: {
      type: "boolean",
      label: "Is Kit",
      description: "Whether the request is a kit or not.",
      optional: true,
    },
    discount: {
      type: "integer",
      label: "Discount",
      description: "The request equipment discount.",
      optional: true,
    },
    linkedEquipment: {
      type: "string",
      label: "Linked Equipment",
      description: "The equipment related with this request.",
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "equipment"),
        returnType: "equipment",
      }),
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project request equipment.",
      optional: true,
    },
    externalRemark: {
      type: "string",
      label: "External Remark",
      description: "The description of the project request equipment.",
      optional: true,
    },
    parent: {
      type: "string",
      label: "Parent",
      description: "The kit or case it is part of.",
      optional: true,
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "projectrequestequipment"),
        returnType: "projectrequestequipment",
      }),
    },
    unitPrice: {
      type: "integer",
      label: "Unit Price",
      description: "The price of the unit.",
      optional: true,
    },
    factor: {
      type: "string",
      label: "Factor",
      description: "The project request equipment's factor.",
      optional: true,
    },
  },
  "projectrequests": {
    planperiodStart: {
      type: "string",
      label: "Plan Period Start",
      description: "The date-time planned to start the project. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
    },
    planperiodEnd: {
      type: "string",
      label: "Plan Period End",
      description: "The date-time planned to end the project. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the project.",
      optional: true,
    },
    linkedContact: {
      type: "string",
      label: "Linked Contact",
      description: "The id of the linked contact.",
      optional: true,
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "contacts"),
        returnType: "contacts",
      }),
    },
    contactMailingStreet: {
      type: "string",
      label: "Contact Mailing Street",
      description: "The contact mailing's street address.",
      optional: true,
    },
    contactMailingNumber: {
      type: "string",
      label: "Contact Mailing Number",
      description: "The contact mailing's street address number.",
      optional: true,
    },
    contactMailingPostalcode: {
      type: "string",
      label: "Contact Mailing Postalcode",
      description: "The contact mailing's postalcode.",
      optional: true,
    },
    contactMailingCity: {
      type: "string",
      label: "Contact Mailing City",
      description: "The contact mailing's city.",
      optional: true,
    },
    contactMailingCountry: {
      type: "string",
      label: "Contact Mailing Country",
      description: "The contact mailing's country.",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The contact's name.",
      optional: true,
    },
    contactPersonFirstName: {
      type: "string",
      label: "Contact Person First Name",
      description: "The contact person's first name.",
      optional: true,
    },
    contactPersonMiddleName: {
      type: "string",
      label: "Contact Person MiddleName",
      description: "The contact person's middle name.",
      optional: true,
    },
    contactPersonLastname: {
      type: "string",
      label: "Contact Person Lastname",
      description: "The contact person's last name.",
      optional: true,
    },
    contactPersonEmail: {
      type: "string",
      label: "Contact Person Email",
      description: "The contact person's email.",
      optional: true,
    },
    usageperiodStart: {
      type: "string",
      label: "Usage Period Start",
      description: "When the usage period starts. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
      optional: true,
    },
    usageperiodEnd: {
      type: "string",
      label: "Usage Period End",
      description: "When the usage period ends. **Format: YYYY-MM-DDTHH:MM:SSSZ**.",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The project's language.",
      optional: true,
    },
    externalReference: {
      type: "integer",
      label: "External Reference",
      description: "An external reference code.",
      optional: true,
    },
    remark: {
      type: "string",
      label: "Remark",
      description: "The project's description.",
      optional: true,
    },
    price: {
      type: "integer",
      label: "Price",
      description: "The project's price.",
      optional: true,
    },
  },
  "stockmovements": {
    equipmentId: {
      type: "string",
      label: "Equipment Id",
      description: "The id of the equipment.",
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "equipment"),
      }),
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount of the equipment.",
      optional: true,
    },
    projectequipment: {
      type: "string",
      label: "Project Equipment",
      description: "The id of the project equipment.",
      optional: true,
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "projectequipment"),
        returnType: "projectequipment",
        filterFunction: ({ equipment }) => equipment === `/equipment/${this.equipmentId}`,
      }),
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the equipment.",
      optional: true,
    },
    details: {
      type: "string",
      label: "Details",
      description: "The details of the equipment.",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the movement.",
      optional: true,
    },
    stockLocation: {
      type: "string",
      label: "Stock Location",
      description: "The id of the stock location.",
      optional: true,
      options: async ({ page }) => this.rentman.asyncOpt({
        page,
        fn: this.rentman.listItems.bind(null, "stocklocations"),
        returnType: "stocklocations",
      }),
    },
  },
};

export const ADDITIONAL_PROPS_SEARCH = {
  "appointments": {
    type: "string",
    label: "Appointment Id",
    description: "The id of the appointment",
    options: async ({ page }) => this.rentman.asyncOpt({
      page,
      fn: this.rentman.listItems.bind(null, "appointments"),
    }),
  },
  "contactpersons": {
    type: "string",
    label: "Person Id",
    description: "The id of the person",
    options: async ({ page }) => this.rentman.asyncOpt({
      page,
      fn: this.rentman.listItems.bind(null, "contactpersons"),
    }),
  },
  "contacts": {
    ...contactId,
    description: "The id of the contact",
  },
  "costs": {
    type: "string",
    label: "Cost Id",
    description: "The id of the cost",
    options: async ({ page }) => this.rentman.asyncOpt({
      page,
      fn: this.rentman.listItems.bind(null, "costs"),
    }),
  },
  "crewavailability": {
    type: "string",
    label: "Crew Availability Id",
    description: "The id of the crewe availability",
    options: async ({ page }) => this.rentman.asyncOpt({
      page,
      fn: this.rentman.listItems.bind(null, "crewavailability"),
    }),
  },
  "payments": {
    type: "string",
    label: "Payment Id",
    description: "The id of the payment",
    options: async ({ page }) => this.rentman.asyncOpt({
      page,
      fn: this.rentman.listItems.bind(null, "payments"),
    }),
  },
  "projectrequestequipment": {
    type: "string",
    label: "Project Request Equipment Id",
    description: "The id of the project request equipment",
    options: async ({ page }) => this.rentman.asyncOpt({
      page,
      fn: this.rentman.listItems.bind(null, "projectrequestequipment"),
    }),
  },
  "projectrequests": {
    ...projectRequestId,
    description: "The id of the project request",
  },
  "stockmovements": {
    type: "string",
    label: "Stock Movement Id",
    description: "The id of the stock movement",
    options: async ({ page }) => this.rentman.asyncOpt({
      page,
      fn: this.rentman.listItems.bind(null, "stockmovements"),
    }),
  },
};

export const CONTACT_NAME_FIELDS = {
  "company": {
    name: {
      type: "string",
      label: "Name",
      description: "The contact's name.",
    },
  },
  "private": {
    firstname: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
      optional: true,
    },
    surfix: {
      type: "string",
      label: "Surfix",
      description: "The contact's middle name.",
      optional: true,
    },
    surname: {
      type: "string",
      label: "Surname",
      description: "The contact's last name.",
      optional: true,
    },
  },
};
