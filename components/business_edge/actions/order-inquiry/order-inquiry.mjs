import app from "../../business_edge.app.mjs";
import { orderReturnSchema } from "../../common/orderReturnSchema.mjs";

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
      type: "string",
      label: "Entity",
      description:
        "Entity number: 1 = Hanger Bolt & Stud Co.; 2 = Enterkin Manufacturing; 3 = Enterkin Leasing",
      options: [
        {
          label: "1 — Hanger Bolt & Stud Co.",
          value: "1",
        },
        {
          label: "2 — Enterkin Manufacturing",
          value: "2",
        },
        {
          label: "3 — Enterkin Leasing",
          value: "3",
        },
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
      optional: true,
    },
    savedSchemaId: {
      type: "string",
      label: "Saved Schema ID (SavedSchemaID)",
      optional: true,
    },
    savedSchemaCode: {
      type: "string",
      label: "Saved Schema Code (SavedSchemaCode)",
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

    const body = {
      Entity: entity,
      DateFormatOpt: dateFormatOpt || "A",
      ...orderReturnSchema,
    };

    if (dateDelim !== undefined && dateDelim !== null && dateDelim !== "") {
      body.DateDelim = dateDelim;
    }
    if (savedSchemaId) {
      body.SavedSchemaID = savedSchemaId;
    }
    if (savedSchemaCode) {
      body.SavedSchemaCode = savedSchemaCode;
    }
    if (chooseOne && typeof chooseOne === "object" && Object.keys(chooseOne).length > 0) {
      body.ChooseOne = chooseOne;
    }

    const data = await this.app.postExport({
      $,
      endpoint: "/documentinq/orderinquiry/export.json",
      data: body,
    });

    $.export("$summary", "Order inquiry completed");
    return data;
  },
};
