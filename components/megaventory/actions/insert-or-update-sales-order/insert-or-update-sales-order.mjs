import app from "../../megaventory.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "megaventory-insert-or-update-sales-order",
  name: "Insert Or Update Sales Order",
  description: "Insert or update a sales order in the database. [See the docs](https://api.megaventory.com/v2017a/documentation/index.html#!/SalesOrder/postSalesOrderSalesOrderUpdate_post_3).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    salesOrderTypeId: {
      label: "Sales Order Type ID",
      description: "The ID of the sales order type.",
      propDefinition: [
        app,
        "documentTypeId",
        () => ({
          args: {
            data: {
              Filters: [
                {
                  FieldName: "DocumentTypeDescription",
                  SearchOperator: "Equals",
                  SearchValue: "Sales Order",
                },
              ],
            },
          },
        }),
      ],
    },
    salesOrderClientId: {
      label: "Client ID",
      description: "The ID of the client.",
      propDefinition: [
        app,
        "supplierClientId",
        () => ({
          args: {
            data: {
              Filters: [
                {
                  FieldName: "SupplierClientType",
                  SearchOperator: "Equals",
                  SearchValue: "Client",
                },
              ],
            },
          },
        }),
      ],
    },
    salesOrderInventoryLocationId: {
      propDefinition: [
        app,
        "inventoryLocationId",
      ],
    },
    salesOrderStatus: {
      type: "string",
      label: "Sales Order Status",
      description: "The status of the sales order.",
      options: Object.values(constants.SALES_ORDER_STATUS),
    },
    productSKU: {
      type: "string",
      label: "Product SKU",
      description: "The SKU of the product.",
      propDefinition: [
        app,
        "product",
        () => ({
          mapper: ({
            ProductSKU: value, ProductDescription: label,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    salesOrderRowQuantity: {
      type: "integer",
      label: "Sales Order Row Quantity",
      description: "The quantity of the product.",
    },
    salesOrderId: {
      optional: true,
      propDefinition: [
        app,
        "salesOrderId",
      ],
    },
    salesOrderNo: {
      type: "string",
      label: "Sales Order No",
      description: "The sales order number.",
      optional: true,
    },
  },
  methods: {
    insertOrUpdateSalesOrder({
      data, ...args
    } = {}) {
      return this.app.post({
        path: "/SalesOrder/SalesOrderUpdate",
        data: {
          mvRecordAction: constants.MV_RECORD_ACTION.INSERT_OR_UPDATE_NON_EMPTY_FIELDS,
          ...data,
        },
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      salesOrderTypeId,
      salesOrderClientId,
      salesOrderInventoryLocationId,
      salesOrderStatus,
      productSKU,
      salesOrderRowQuantity,
      salesOrderId,
      salesOrderNo,
    } = this;

    const response = await this.insertOrUpdateSalesOrder({
      data: {
        mvSalesOrder: {
          SalesOrderTypeId: salesOrderTypeId,
          SalesOrderClientID: salesOrderClientId,
          SalesOrderInventoryLocationID: salesOrderInventoryLocationId,
          SalesOrderStatus: salesOrderStatus,
          SalesOrderDetails: [
            {
              SalesOrderRowProductSKU: productSKU,
              SalesOrderRowQuantity: salesOrderRowQuantity,
            },
          ],
          SalesOrderId: salesOrderId,
          SalesOrderNo: salesOrderNo,
        },
      },
    });

    step.export("$summary", `Successfully inserted or updated sales order with ID ${response.mvSalesOrder.SalesOrderId}.`);

    return response;
  },
};
