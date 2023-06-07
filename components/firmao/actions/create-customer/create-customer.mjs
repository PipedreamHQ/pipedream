import firmao from "../../firmao.app.mjs";

export default {
  name: "Create Customer",
  description: "Create customer. [See the documentation]()",
  key: "firmao-create-customer",
  version: "0.0.6",
  type: "action",
  props: {
    firmao,
    bankAccountNumber: {
      type: "string",
      label: "Bank Account Number",
      description: "The bank account number of the customer",
    },
    correspondenceAddressCity: {
      type: "string",
      label: "Correspondence Address City",
      description: "The city of the customer's correspondence address",
    },
    correspondenceAddressCountry: {
      type: "string",
      label: "Correspondence Address Country",
      description: "The country of the customer's correspondence address",
    },
    correspondenceAddressCounty: {
      type: "string",
      label: "Correspondence Address County",
      description: "The county of the customer's correspondence address",
      optional: true,
    },
    correspondenceAddressPostCode: {
      type: "string",
      label: "Correspondence Address Post Code",
      description: "The post code of the customer's correspondence address",
    },
    correspondenceAddressStreet: {
      type: "string",
      label: "Correspondence Address Street",
      description: "The street of the customer's correspondence address",
    },
    customerGroups: {
      type: "string[]",
      label: "Customer Groups",
      description: "The customer groups the customer belongs to",
      optional: true,
    },
    customerType: {
      type: "string",
      label: "Customer Type",
      description: "The type of the customer (e.g. PARTNER)",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the customer",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "The email addresses of the customer",
    },
    employeesNumber: {
      type: "integer",
      label: "Employees Number",
      description: "The number of employees of the customer",
    },
    faxNumber: {
      type: "string",
      label: "Fax Number",
      description: "The fax number of the customer",
      optional: true,
    },
    label: {
      type: "string",
      label: "Label",
      description: "A label for the customer",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
    },
    nipNumber: {
      type: "string",
      label: "NIP Number",
      description: "The NIP number of the customer",
    },
    officeAddressCity: {
      type: "string",
      label: "Office Address City",
      description: "The city of the customer's office address",
    },
    officeAddressCountry: {
      type: "string",
      label: "Office Address Country",
      description: "The country of the customer's office address",
    },
    officeAddressPostCode: {
      type: "string",
      label: "Office Address Post Code",
      description: "The post code of the customer's office address",
    },
    officeAddressStreet: {
      type: "string",
      label: "Office Address Street",
      description: "The street of the customer's office address",
    },
    ownership: {
      type: "string",
      label: "Ownership",
      description: "The ownership type of the customer (e.g. PRIVATE)",
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "The phone numbers of the customer",
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the customer",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the customer",
      optional: true,
    },
    voivodeship: {
      type: "string",
      label: "Voivodeship",
      description: "The voivodeship of the customer",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website of the customer",
    },
  },
  async run({ $ }) {
    const result = await this.firmao.createCustomer({
      $,
      data: {
        "bankAccountNumber": this.bankAccountNumber,
        "correspondenceAddress": {
          city: this.correspondenceAddressCity,
          country: this.correspondenceAddressCountry,
          county: this.correspondenceAddressCounty,
          postCode: this.correspondenceAddressPostCode,
          street: this.correspondenceAddressStreet,
        },
        "customerGroups": this.customerGroups,
        "customerType": "PARTNER",
        "description": "Company specializing in computer service",
        "emails": [
          "compservice.firmao@mailinator.com",
          "computers@mailinator.com",
        ],
        "employeesNumber": 1,
        "faxNumber": "22 398 78 87",
        "label": "COMP-SERVICE",
        "name": "COMP-SERVICE John Smith",
        "nipNumber": "7291077843",
        "officeAddress.city": "New York",
        "officeAddress.country": "USA",
        "officeAddress.postCode": "10001",
        "officeAddress.street": "143 Parker Ave",
        "ownership": "PRIVATE",
        "phones": [
          "223457426",
        ],
        "status": null,
        "tags": [],
        "voivodeship": null,
        "website": "www.compservice.bis",
      },
    });
    $.export("$summary", "Customer created");
    return result;
  },
};
