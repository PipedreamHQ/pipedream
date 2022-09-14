import app from "../../upkeep.app.mjs";
import utils from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  props: {
    app,
    vendorId: {
      propDefinition: [
        app,
        "vendorId",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    purchaseOrderNumber: {
      type: "string",
      label: "Purchase Order Number",
      description: "Set a custom purchase order number. If not passed, the default one from settings will be used.",
      optional: true,
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date, in `yyyy-MM-dd` format, e.g. `2018-06-30`",
      optional: true,
    },
    poDate: {
      type: "string",
      label: "Purchase Order Date",
      description: "Date of purchase order, in `yyyy-MM-dd` format, e.g. `2018-06-28`",
      optional: true,
    },
    parts: {
      propDefinition: [
        app,
        "parts",
      ],
      description: "An array of Part IDs to include with the purchase order",
    },
    respectivePartQuantityUsed: {
      propDefinition: [
        app,
        "respectivePartQuantityUsed",
      ],
    },
    otherFields: {
      type: "object",
      label: "Other Fields",
      description: "The fields does not exist in this integration. Please see (docs)[https://developers.onupkeep.com/#purchase-orders] for more fields, e.g. `{\"companyCity\":\"Los Angeles\",\"companyState\":\"California\",\"companyZip\":\"90224\"}`",
      optional: true,
    },
    customFieldsPO: {
      type: "string[]",
      label: "Custom Fields",
      description: "A list of custom fields of the purchase order. Its child attributes are `name`, `value`, and `unit`, e.g. `{\"name\": \"SAPPONumber\",\"value\": \"110-235\"}`",
      optional: true,
    },
  },
  methods: {
    prepareData() {
      if (this.parts.length != this.respectivePartQuantityUsed.length)
        throw new ConfigurationError("`Respective Part Quantities`  and `Parts` must have the same length!");
      const parts = [];
      for (let i = 0; i < this.parts.length; i++) {
        parts.push({
          id: this.parts[i],
          quantity: this.respectivePartQuantityUsed[i],
        });
      }
      return {
        title: this.title,
        vendor: this.vendorId,
        category: this.categoryId,
        purchaseOrderNumber: parseInt(this.purchaseOrderNumber),
        description: this.description,
        parts,
        customFieldsPO: utils.parseArray(this.customFieldsPO),
        ...utils.parseObject(this.otherFields),
      };
    },
  },
};
