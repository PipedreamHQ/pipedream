import app from "../../mews.app.mjs";

export default {
  name: "Fetch Customers",
  description: "Retrieve customers using Mews Connector API. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/customers#get-all-customers)",
  key: "mews-fetch-customers",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    createdStartUtc: {
      propDefinition: [
        app,
        "createdStartUtc",
      ],
    },
    createdEndUtc: {
      propDefinition: [
        app,
        "createdEndUtc",
      ],
    },
    updatedStartUtc: {
      propDefinition: [
        app,
        "updatedStartUtc",
      ],
    },
    updatedEndUtc: {
      propDefinition: [
        app,
        "updatedEndUtc",
      ],
    },
    deletedStartUtc: {
      propDefinition: [
        app,
        "deletedStartUtc",
      ],
    },
    deletedEndUtc: {
      propDefinition: [
        app,
        "deletedEndUtc",
      ],
    },
    activityStates: {
      type: "string[]",
      label: "Activity States",
      description: "Whether to return only active, only deleted or both records.",
      optional: true,
      options: [
        "Active",
        "Deleted",
      ],
    },
    customerIds: {
      type: "string[]",
      label: "Customer IDs",
      description: "Unique identifiers of Customers. Required if no other filter is provided. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "customerId",
      ],
    },
    companyIds: {
      type: "string[]",
      label: "Company IDs",
      description: "Unique identifier of the Company the customer is associated with. Max 1 item.",
      optional: true,
      propDefinition: [
        app,
        "companyId",
      ],
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Emails of the Customers. Max 1000 items.",
      optional: true,
      propDefinition: [
        app,
        "customerId",
        () => ({
          mapper: (customer) => ({
            label: `${customer.FirstName} ${customer.LastName}`,
            value: customer.Email,
          }),
        }),
      ],
    },
    firstNames: {
      type: "string[]",
      label: "First Names",
      description: "First names of the Customers. Max 1000 items.",
      optional: true,
    },
    lastNames: {
      type: "string[]",
      label: "Last Names",
      description: "Last names of the Customers. Max 1000 items.",
      optional: true,
    },
    extentCustomers: {
      type: "boolean",
      label: "Extent - Customers",
      description: "Whether to include customer data in the response.",
      optional: true,
      default: true,
    },
    extentAddresses: {
      type: "boolean",
      label: "Extent - Addresses",
      description: "Whether to include address data in the response.",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      app,
      createdStartUtc,
      createdEndUtc,
      updatedStartUtc,
      updatedEndUtc,
      deletedStartUtc,
      deletedEndUtc,
      activityStates,
      customerIds,
      companyIds,
      emails,
      firstNames,
      lastNames,
      extentCustomers,
      extentAddresses,
    } = this;

    const items = await app.paginate({
      requester: app.customersGetAll,
      requesterArgs: {
        $,
        data: {
          ...(createdStartUtc || createdEndUtc) && {
            CreatedUtc: {
              StartUtc: createdStartUtc,
              EndUtc: createdEndUtc,
            },
          },
          ...(updatedStartUtc || updatedEndUtc) && {
            UpdatedUtc: {
              StartUtc: updatedStartUtc,
              EndUtc: updatedEndUtc,
            },
          },
          ...(deletedStartUtc || deletedEndUtc) && {
            DeletedUtc: {
              StartUtc: deletedStartUtc,
              EndUtc: deletedEndUtc,
            },
          },
          Extent: {
            Customers: extentCustomers,
            Addresses: extentAddresses,
          },
          ActivityStates: activityStates,
          CustomerIds: customerIds,
          CompanyIds: companyIds,
          Emails: emails,
          FirstNames: firstNames,
          LastNames: lastNames,
        },
      },
      resultKey: "Customers",
    });

    $.export("$summary", `Successfully fetched ${items.length} customer${items.length !== 1
      ? "s"
      : ""}`);
    return items;
  },
};

