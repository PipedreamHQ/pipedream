import app from "../../business_edge.app.mjs";
import { orderReturnSchema } from "../../common/orderReturnSchema.mjs";
import { normalizeDateFormatOpt } from "../../common/dateFormat.mjs";
import { isChooseOneObject } from "../../common/propUtils.mjs";

export default {
  key: "business_edge-order-inquiry",
  name: "Order Inquiry",
  description:
    "Query orders from Business Edge via `POST /documentinq/orderinquiry/export.json`. [API index](https://hangerbolt.ci-inc.com/apilist/export)",
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
      type: "string",
      label: "Date Format (DateFormatOpt)",
      description:
        "A=mm-dd-yy; B=yy-mm-dd; C=yyyy-mm-dd; D=mmddyy; E=yymmdd; F=yyyymmdd; G=dd-mm-yy; H=ddmmyy",
      optional: true,
      default: "A",
    },
    dateDelim: {
      type: "string",
      label: "Date Delimiter (DateDelim)",
      description: "Optional delimiter used with formatted dates in the API request",
      optional: true,
    },
    savedSchemaId: {
      type: "string",
      label: "Saved Schema ID (SavedSchemaID)",
      description: "Optional saved API schema ID for returned data (use with or instead of schema code)",
      optional: true,
    },
    savedSchemaCode: {
      type: "string",
      label: "Saved Schema Code (SavedSchemaCode)",
      description: "Optional saved API schema code for returned data (use with or instead of schema ID)",
      optional: true,
    },
    chooseOne: {
      type: "object",
      label: "Choose One (ChooseOne)",
      description:
        "List of orders and/or Range (Range is used if both are sent). Example: `{ \"List\": [{ \"OrdNum\": \"12345\" }] }`",
      optional: true,
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
