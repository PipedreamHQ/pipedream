import app from "../../megaventory.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "megaventory-insert-or-update-purchase-order",
  name: "Insert Or Update Purchase Order",
  description: "Insert or update a purchase order in the database. [See the docs](https://api.megaventory.com/v2017a/documentation/index.html#!/PurchaseOrder/postPurchaseOrderPurchaseOrderUpdate_post_3).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    purchaseOrderTypeId: {
      label: "Purchase Order Type ID",
      description: "The ID of the purchase order type.",
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
                  SearchValue: "Purchase Order",
                },
              ],
            },
          },
        }),
      ],
    },
    supplier: {
      label: "Supplier ID",
      description: "The ID of the supplier.",
      withLabel: true,
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
                  SearchValue: "Supplier",
                },
              ],
            },
          },
        }),
      ],
    },
    purchaseOrderInventoryLocationId: {
      propDefinition: [
        app,
        "inventoryLocationId",
      ],
    },
    purchaseOrderStatus: {
      type: "string",
      label: "Purchase Order Status",
      description: "The status of the purchase order.",
      options: Object.values(constants.PURCHASE_ORDER_STATUS),
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
    purchaseOrderRowQuantity: {
      type: "integer",
      label: "Purchase Order Row Quantity",
      description: "The quantity of the product.",
    },
    purchaseOrderId: {
      optional: true,
      propDefinition: [
        app,
        "purchaseOrderId",
      ],
    },
    purchaseOrderNo: {
      type: "string",
      label: "Purchase Order No",
      description: "The purchase order number.",
      optional: true,
    },
  },
  methods: {
    insertOrUpdatePurchaseOrder({
      data, ...args
    } = {}) {
      return this.app.post({
        path: "/PurchaseOrder/PurchaseOrderUpdate",
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
      purchaseOrderTypeId,
      supplier,
      purchaseOrderInventoryLocationId,
      purchaseOrderStatus,
      productSKU,
      purchaseOrderRowQuantity,
      purchaseOrderId,
      purchaseOrderNo,
    } = this;

    const supplierId = supplier?.value ?? supplier;
    const supplierName = supplier?.label;

    const response = await this.insertOrUpdatePurchaseOrder({
      data: {
        mvPurchaseOrder: {
          PurchaseOrderTypeId: purchaseOrderTypeId,
          PurchaseOrderSupplierID: supplierId || 0,
          PurchaseOrderSupplierName: supplierName,
          PurchaseOrderInventoryLocationID: purchaseOrderInventoryLocationId,
          PurchaseOrderStatus: purchaseOrderStatus,
          PurchaseOrderDetails: [
            {
              PurchaseOrderRowProductSKU: productSKU,
              PurchaseOrderRowQuantity: purchaseOrderRowQuantity,
            },
          ],
          PurchaseOrderId: purchaseOrderId,
          PurchaseOrderNo: purchaseOrderNo,
        },
      },
    });

    step.export("$summary", `Successfully inserted or updated purchase order with ID ${response.mvPurchaseOrder.PurchaseOrderId}.`);

    return response;
  },
};
