import app from "../../business_edge.app.mjs";
import { orderReturnSchema } from "../../common/orderReturnSchema.mjs";
import { normalizeDateFormatOpt } from "../../common/dateFormat.mjs";
import { isChooseOneObject } from "../../common/propUtils.mjs";

export default {
  key: "business_edge-order-inquiry",
  name: "Order Inquiry",
  description:
    "Query orders from Business Edge via `POST /documentinq/orderinquiry/export.json`. [See the documentation](https://hangerbolt.ci-inc.com/apilist/export)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    entity: {
      propDefinition: [
        app,
        "entity",
      ],
    },
    dateFormatOpt: {
      propDefinition: [
        app,
        "dateFormatOpt",
      ],
    },
    dateDelim: {
      propDefinition: [
        app,
        "dateDelim",
      ],
    },
    savedSchemaId: {
      propDefinition: [
        app,
        "savedSchemaId",
      ],
    },
    savedSchemaCode: {
      propDefinition: [
        app,
        "savedSchemaCode",
      ],
    },
    chooseOne: {
      propDefinition: [
        app,
        "chooseOne",
      ],
      description:
        "List of orders and/or Range (Range is used if both are sent). Example: `{ \"List\": [{ \"OrdNum\": \"12345\" }] }`",
    },
  },
  async run({ $ }) {
    const {
      entity,
      dateFormatOpt,
      dateDelim,
      savedSchemaId,
      savedSchemaCode,
      chooseOne,
    } = this;

    const fmt = normalizeDateFormatOpt(dateFormatOpt);
    const body = {
      Entity: entity,
      DateFormatOpt: fmt,
      ...orderReturnSchema,
    };

    if (dateDelim) {
      body.DateDelim = dateDelim;
    }
    if (savedSchemaId) {
      body.SavedSchemaID = savedSchemaId;
    }
    if (savedSchemaCode) {
      body.SavedSchemaCode = savedSchemaCode;
    }
    if (isChooseOneObject(chooseOne)) {
      body.ChooseOne = chooseOne;
    }

    const data = await this.app.postExport({
      $,
      endpoint: "/documentinq/orderinquiry/export.json",
      data: body,
    });

    const orders = Array.isArray(data?.Order)
      ? data.Order
      : [];
    $.export(
      "$summary",
      `Successfully retrieved ${orders.length} orders`,
    );
    return data;
  },
};
