import app from "../../netsuite.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "netsuite-create-sales-order",
  name: "Create Sales Order",
  description: "Creates a new sales order. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag-salesOrder)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: false,
  },
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    tranDate: {
      type: "string",
      label: "Transaction Date",
      description: "The posting date of this sales order (format: `YYYY-MM-DD`). Defaults to today's date if not specified.",
      optional: true,
    },
    subsidiaryId: {
      propDefinition: [
        app,
        "subsidiaryId",
      ],
      optional: true,
    },
    items: {
      propDefinition: [
        app,
        "items",
      ],
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "A memo to describe this sales order. It will appear on reports such as the 2-line Sales Orders register.",
      optional: true,
    },
    otherRefNum: {
      type: "string",
      label: "PO/Check Number",
      description: "If your customer is paying by check, enter the number here. If your customer is issuing a purchase order, enter the PO number here.",
      optional: true,
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to include in the sales order as a JSON object. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html) for available fields.",
      optional: true,
    },
    replace: {
      propDefinition: [
        app,
        "replace",
      ],
    },
    propertyNameValidation: {
      propDefinition: [
        app,
        "propertyNameValidation",
      ],
    },
    propertyValueValidation: {
      propDefinition: [
        app,
        "propertyValueValidation",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      customerId,
      tranDate,
      subsidiaryId,
      items,
      memo,
      otherRefNum,
      additionalFields,
      replace,
      propertyNameValidation,
      propertyValueValidation,
    } = this;

    const response = await app.createSalesOrder({
      $,
      headers: {
        "X-NetSuite-PropertyNameValidation": propertyNameValidation,
        "X-NetSuite-PropertyValueValidation": propertyValueValidation,
      },
      params: {
        replace,
      },
      data: {
        entity: {
          id: customerId,
        },
        tranDate,
        ...(subsidiaryId && {
          subsidiary: {
            id: subsidiaryId,
          },
        }),
        ...(items && {
          item: {
            items: utils.parseJson(items),
          },
        }),
        memo,
        otherRefNum,
        ...(additionalFields && utils.parseJson(additionalFields)),
      },
    });

    $.export("$summary", "Successfully created sales order");
    return response;
  },
};
