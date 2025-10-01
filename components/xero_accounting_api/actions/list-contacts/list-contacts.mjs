import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-list-contacts",
  name: "List Contacts",
  description: "Lists information from contacts in the given tenant id as per filter parameters.",
  version: "0.2.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
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
    try {
      const response = await this.xeroAccountingApi.listContacts({
        $,
        tenantId: this.tenantId,
        modifiedSince: this.modifiedAfter,
        params: {
          IDs: this.ids,
          Where: this.where,
          order: this.order,
          page: this.page,
          includeArchived: this.includeArchived,
        },
      });

      $.export("$summary", `Successfully fetched ${response.Contacts.length} contacts`);
      return response;
    } catch (e) {
      $.export("$summary", "No contacts found");
      return {};
    }
  },
};
