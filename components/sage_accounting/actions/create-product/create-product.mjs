import app from "../../sage_accounting.app.mjs";

export default {
  key: "sage_accounting-create-product",
  name: "Create Product",
  description: "Creates a new product in Sage Accounting. [See the documentation](https://developer.sage.com/accounting/reference/products/#tag/Products/operation/postProducts)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    description: {
      type: "string",
      label: "Description",
      description: "The product description",
    },
    salesLedgerAccountId: {
      propDefinition: [
        app,
        "ledgerAccountId",
        () => ({
          type: "SALES",
        }),
      ],
      label: "Sales Ledger Account ID",
      description: "The sales ledger account for the product",
      optional: false,
    },
    purchaseLedgerAccountId: {
      propDefinition: [
        app,
        "ledgerAccountId",
        () => ({
          type: "DIRECT_EXPENSES",
        }),
      ],
      label: "Purchase Ledger Account ID",
      description: "The purchase ledger account for the product",
      optional: false,
    },
    itemCode: {
      type: "string",
      label: "Item Code",
      description: "The item code for the product",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "The notes for the product",
      optional: true,
    },
    salesTaxRateId: {
      propDefinition: [
        app,
        "taxRateId",
      ],
      label: "Sales Tax Rate ID",
      description: "The ID of the Sales Tax Rate",
    },
    usualSupplierId: {
      type: "string",
      label: "Usual Supplier ID",
      description: "The ID of the Usual Supplier",
      async options({ page }) {
        const suppliers = await this.app.listSuppliers({
          page,
        });
        return suppliers.map((supplier) => ({
          label: supplier.displayed_as,
          value: supplier.id,
        }));
      },
      optional: true,
    },
    purchaseTaxRateId: {
      propDefinition: [
        app,
        "taxRateId",
      ],
      label: "Purchase Tax Rate ID",
      description: "The ID of the Purchase Tax Rate",
    },
    costPrice: {
      type: "string",
      label: "Cost Price",
      description: "The cost price of the product",
      optional: true,
    },
    sourceGuid: {
      type: "string",
      label: "Source GUID",
      description: "Used when importing products from external sources",
      optional: true,
    },
    purchaseDescription: {
      type: "string",
      label: "Purchase Description",
      description: "The product purchase description",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Indicates whether the product is active",
      optional: true,
      default: true,
    },
    catalogItemTypeId: {
      type: "string",
      label: "Catalog Item Type ID",
      description: "The ID of the Catalog Item Type",
      async options({ page }) {
        const catalogItemTypes = await this.app.listCatalogItemTypes({
          page,
        });
        return catalogItemTypes.map((type) => ({
          label: type.displayed_as,
          value: type.id,
        }));
      },
      optional: true,
    },
  },
  async run({ $ }) {

    const response = await this.app.createProduct({
      $,
      data: {
        product: {
          description: this.description,
          sales_ledger_account_id: this.salesLedgerAccountId,
          purchase_ledger_account_id: this.purchaseLedgerAccountId,
          item_code: this.itemCode,
          notes: this.notes,
          sales_tax_rate_id: this.salesTaxRateId,
          usual_supplier_id: this.usualSupplierId,
          purchase_tax_rate_id: this.purchaseTaxRateId,
          cost_price: this.costPrice,
          source_guid: this.sourceGuid,
          purchase_description: this.purchaseDescription,
          active: this.active,
          catalog_item_type_id: this.catalogItemTypeId,
        },
      },
    });

    $.export("$summary", `Successfully created product: ${response.description || response.displayed_as}`);
    return response;
  },
};
