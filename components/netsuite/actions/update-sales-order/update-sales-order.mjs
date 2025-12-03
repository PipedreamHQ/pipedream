import app from "../../netsuite.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "netsuite-update-sales-order",
  name: "Update Sales Order",
  description: "Updates an existing sales order. [See the documentation](https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag-salesOrder)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  props: {
    app,
    salesOrderId: {
      propDefinition: [
        app,
        "salesOrderId",
      ],
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
      optional: true,
    },
    tranDate: {
      type: "string",
      label: "Transaction Date",
      description: "The posting date of this sales order (format: `YYYY-MM-DD`).",
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
    replaceSelectedFields: {
      type: "boolean",
      label: "Replace Selected Fields",
      description: "If set to true, all fields that should be deleted in the update request, including body fields, must be included in the **Replace Sublists** query parameter",
      optional: true,
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
      salesOrderId,
      customerId,
      tranDate,
      subsidiaryId,
      items,
      memo,
      otherRefNum,
      additionalFields,
      replace,
      replaceSelectedFields,
      propertyNameValidation,
      propertyValueValidation,
    } = this;

    const response = await app.updateSalesOrder({
      $,
      salesOrderId,
      headers: {
        "X-NetSuite-PropertyNameValidation": propertyNameValidation,
        "X-NetSuite-PropertyValueValidation": propertyValueValidation,
      },
      params: {
        replace,
        replaceSelectedFields,
      },
      data: {
        ...(customerId && {
          entity: {
            id: customerId,
          },
        }),
        tranDate,
        ...(subsidiaryId && {
          subsidiary: {
            id: subsidiaryId,
          },
        }),
        ...items && {
          item: {
            items: utils.parseJson(items),
          },
        },
        memo,
        otherRefNum,
        ...(additionalFields && utils.parseJson(additionalFields)),
      },
    });

    $.export("$summary", `Successfully updated sales order with ID ${salesOrderId}`);
    return response;
  },
};
