import app from "../../upkeep.app.mjs";
import utils from "../../common/utils.mjs";

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
      type: "string[]",
      label: "Parts",
      description: "A list of parts of the purchase order. Its child attributes are `id` and `quantity`, e.g. `{\"id\": \"t0RYP2jIPz\",\"quantity\": 5}`",
      optional: true,
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
      return {
        title: this.title,
        vendorId: this.vendorId,
        category: this.categoryId,
        purchaseOrderNumber: parseInt(this.purchaseOrderNumber),
        description: this.description,
        parts: utils.parseArray(this.parts),
        customFieldsPO: utils.parseArray(this.customFieldsPO),
        ...utils.parseObject(this.otherFields),
      };
    },
  },
};
