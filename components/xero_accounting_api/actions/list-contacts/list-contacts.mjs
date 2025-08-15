import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-list-contacts",
  name: "List Contacts",
  description: "Lists information from contacts in the given tenant id as per filter parameters.",
  version: "0.1.2",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    contactIdentifier: {
      label: "Contact Identifier",
      type: "string",
      description: "A contact identifier. Possible values: \n* **ContactID** - The Xero identifier for a contact e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **ContactNumber** -  A custom identifier specified from another system e.g. a CRM system has a contact number of CUST100",
      optional: true,
    },
    modifiedAfter: {
      label: "Modified After",
      description: "Filter by a date. Only contacts modified since this date will be returned. Format: YYYY-MM-DD",
      type: "string",
      optional: true,
    },
    ids: {
      label: "IDs",
      type: "string",
      description: "Filter by a comma-separated list of ContactIDs. Allows you to retrieve a specific set of contacts in a single call. See [details.](https://developer.xero.com/documentation/api/contacts#optimised-queryparameters)",
      optional: true,
    },
    where: {
      label: "Where",
      type: "string",
      description: "Filter using the where parameter. We recommend you limit filtering to the [optimised elements](https://developer.xero.com/documentation/api/contacts#optimised-parameters) only.",
      optional: true,
    },
    order: {
      label: "Order",
      type: "string",
      description: "Order by any element returned ([*see Order By.*](https://developer.xero.com/documentation/api/requests-and-responses#ordering))",
      optional: true,
    },
    page: {
      label: "Page",
      type: "string",
      description: "Up to 100 contacts will be returned per call when the page parameter is used e.g. page=1.",
      optional: true,
    },
    includeArchived: {
      label: "Include Archived",
      type: "boolean",
      description: "e.g. includeArchived=true - Contacts with a status of ARCHIVED will be included in the response.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.xeroAccountingApi.listContacts({
      $,
      tenantId: this.tenantId,
      contactIdentifier: this.contactIdentifier,
      modifiedAfter: this.modifiedAfter,
      params: {
        IDs: this.ids,
        Where: this.where,
        order: this.order,
        page: this.page,
        includeArchived: this.includeArchived,
      },
    });

    $.export("$summary", `Successfully fetched contacts with ID: ${this.contactIdentifier}`);
    return response;
  },
};
