import { ConfigurationError } from "@pipedream/platform";
import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Create Order",
  description: "Create an order in Mews. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/orders#add-order)",
  key: "mews-create-order",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    accountType: {
      propDefinition: [
        app,
        "accountType",
      ],
    },
    accountId: {
      propDefinition: [
        app,
        "accountId",
        ({ accountType }) => ({
          accountType,
        }),
      ],
    },
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description: "Identifier of the Service to be ordered.",
    },
    billId: {
      propDefinition: [
        app,
        "billId",
      ],
    },
    linkedReservationId: {
      propDefinition: [
        app,
        "reservationId",
      ],
      label: "Linked Reservation ID",
      description: "Identifier of the Reservation to which the created order will be linked.",
      optional: true,
    },
    consumptionUtc: {
      type: "string",
      label: "Consumption (UTC)",
      description: "Date and time of the order consumption in UTC timezone in ISO 8601 format. If not specified, current date and time is used.",
      optional: true,
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
      description: "Additional notes of the order.",
      optional: true,
    },
    productOrders: {
      type: "string[]",
      label: "Product Orders",
      description: `Array of product orders in JSON format. Each order must include:

**Required:**
- \`ProductId\` (string) - Unique identifier of the Product to be ordered

**Optional:**
- \`Count\` (number) - Count of products to be ordered (e.g. 10 in case of 10 beers)
- \`UnitAmount\` (object) - Unit amount of the product that overrides the amount defined in Mews:
  - \`Currency\` (string) - ISO-4217 currency code
  - \`GrossValue\` (number) - Gross value including all taxes
  - \`NetValue\` (number) - Net value excluding taxes
  - \`TaxCodes\` (string[]) - Tax codes applied to the amount
- \`StartUtc\` (string) - Product start in UTC timezone in ISO 8601 format (for Add order operation this can be omitted)
- \`EndUtc\` (string) - Product end in UTC timezone in ISO 8601 format (for Add order operation this can be omitted)

*Note: Either GrossValue or NetValue must be specified in amount objects, but not both. For products with charging Once and PerPerson, StartUtc and EndUtc must be set to the same value.*

**Example:**
\`\`\`json
[
  {
    "ProductId": "12345678-1234-1234-1234-123456789012",
    "Count": 2,
    "UnitAmount": {
      "Currency": "USD",
      "GrossValue": 15.50,
      "TaxCodes": ["VAT"]
    },
    "StartUtc": "2025-01-01T00:00:00Z",
    "EndUtc": "2025-01-01T00:00:00Z"
  }
]
\`\`\``,
      optional: true,
    },
    items: {
      type: "string[]",
      label: "Items",
      description: `Array of custom items in JSON format. Each item must include:

**Required:**
- \`Name\` (string) - Name of the item
- \`UnitCount\` (integer) - Count of units to be ordered (must be positive)
- \`UnitAmount\` (object) - Amount per unit of the item:
  - \`Currency\` (string) - ISO-4217 currency code
  - \`GrossValue\` (number) - Gross value including all taxes
  - \`NetValue\` (number) - Net value excluding taxes
  - \`TaxCodes\` (string[]) - Tax codes applied to the amount

**Optional:**
- \`AccountingCategoryId\` (string) - Identifier of the Accounting Category

*Note: Either GrossValue or NetValue must be specified in UnitAmount, but not both.*

**Example:**
\`\`\`json
[
  {
    "Name": "Room Service",
    "UnitCount": 1,
    "UnitAmount": {
      "Currency": "USD",
      "GrossValue": 25.00,
      "TaxCodes": ["VAT"]
    },
    "AccountingCategoryId": "87654321-4321-4321-4321-210987654321"
  }
]
\`\`\``,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      accountId,
      serviceId,
      billId,
      linkedReservationId,
      consumptionUtc,
      notes,
      productOrders,
      items,
    } = this;

    const parsedProductOrders = productOrders
      ? utils.parseArray(productOrders)
      : undefined;
    const parsedItems = items
      ? utils.parseArray(items)
      : undefined;

    if (parsedProductOrders && !Array.isArray(parsedProductOrders)) {
      throw new ConfigurationError("**Product Orders** must be an array when provided");
    }

    if (parsedItems && !Array.isArray(parsedItems)) {
      throw new ConfigurationError("**Items** must be an array when provided");
    }

    const response = await app.ordersCreate({
      $,
      data: {
        AccountId: accountId,
        ServiceId: serviceId,
        BillId: billId,
        LinkedReservationId: linkedReservationId,
        ConsumptionUtc: consumptionUtc,
        Notes: notes,
        ProductOrders: parsedProductOrders,
        Items: parsedItems,
      },
    });

    $.export("$summary", "Successfully created order");
    return response;
  },
};
