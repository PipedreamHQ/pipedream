export default {
  AccountId: {
    type: "string",
    label: "Account ID",
    description: "ID of the account that's the parent of this contact. We recommend that you update up to 50 contacts simultaneously when changing the accounts on contacts enabled for a Customer Portal or partner portal. We also recommend that you make this update after business hours.",
  },
  Birthdate: {
    type: "string",
    label: "Birth Date",
    description: "The contact's birth date.Filter criteria for report filters, list view filters, and SOQL queries ignore the year portion of the Birthdate field. For example, this SOQL query returns contacts with birthdays later in the year than today:view sourceprint?1SELECT Name, Birthdate2FROM Contact3WHERE Birthdate &gt; TODAY",
  },
  Department: {
    type: "string",
    label: "Department",
    description: "The contact's department.",
  },
  Description: {
    type: "string",
    label: "Description",
    description: "A description of the contact. Label is Contact Description up to 32 KB.",
  },
  Email: {
    type: "string",
    label: "Email",
    description: "The contact's email address.",
  },
  FirstName: {
    type: "string",
    label: "First Name",
    description: "The contact's first name up to 40 characters.",
  },
  Phone: {
    type: "string",
    label: "Phone",
    description: "Telephone number for the contact. Label is Business Phone.",
  },
  Suffix: {
    type: "string",
    label: "Suffix",
    description: "Name suffix of the contact up to 40 characters. To enable this field, ask Salesforce Customer Support for help.",
  },
  Title: {
    type: "string",
    label: "Title",
    description: "Title of the contact, such as CEO or Vice President.",
  },
};
