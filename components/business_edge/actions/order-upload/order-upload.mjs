import app from "../../business_edge.app.mjs";
import { orderReturnSchema } from "../../common/orderReturnSchema.mjs";

function lineHasProductIdentifier(line) {
  return Boolean(
    line?.ProdCode
    || line?.ProdID
    || line?.BinBarcode
    || line?.AnyScan,
  );
}

export default {
  key: "business_edge-order-upload",
  name: "Order Upload",
  description:
    "Upload an order to Business Edge via `POST /documents/orderupload/export.json`. ImpOrder is required and validated before the request (OrdDate, ImpDtlLine with product id + OrdQty; ShipTo/BillTo/ThirdPartyBillTo require Name when set). [API index](https://hangerbolt.ci-inc.com/apilist/export)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
      description: "Optional delimiter used with formatted dates in the API request",
      optional: true,
      default: "-",
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
    impOrder: {
      type: "object",
      label: "Import Order (ImpOrder)",
      description:
        "Order header and lines (ImpDtlLine). OrdDate required; each line needs OrdQty plus one of ProdCode, ProdID, BinBarcode, AnyScan; optional ShipTo/BillTo/ThirdPartyBillTo require Name when included",
      optional: false,
    },
  },
  methods: {
    /**
     * Ensures ImpOrder is present and matches minimum shape before calling the API.
     * @param {object} impOrder
     */
    validateImpOrder(impOrder) {
      if (
        impOrder == null
        || typeof impOrder !== "object"
        || Array.isArray(impOrder)
      ) {
        throw new Error(
          "ImpOrder is required and must be a plain object (order header and lines).",
        );
      }

      const ordDate = impOrder.OrdDate;
      if (ordDate == null || String(ordDate).trim() === "") {
        throw new Error(
          "ImpOrder.OrdDate is required (order date; use format matching DateFormatOpt).",
        );
      }

      const lines = impOrder.ImpDtlLine;
      if (!Array.isArray(lines) || lines.length === 0) {
        throw new Error(
          "ImpOrder.ImpDtlLine is required and must be a non-empty array of line items.",
        );
      }

      lines.forEach((line, i) => {
        if (line == null || typeof line !== "object" || Array.isArray(line)) {
          throw new Error(
            `ImpOrder.ImpDtlLine[${i}] must be an object.`,
          );
        }
        const qty = line.OrdQty;
        if (qty == null || String(qty).trim() === "") {
          throw new Error(
            `ImpOrder.ImpDtlLine[${i}].OrdQty is required.`,
          );
        }
        if (!lineHasProductIdentifier(line)) {
          throw new Error(
            `ImpOrder.ImpDtlLine[${i}] must include one of ProdCode, ProdID, `
            + "BinBarcode, or AnyScan.",
          );
        }
      });

      const addressKeys = [
        "ShipTo",
        "BillTo",
        "ThirdPartyBillTo",
      ];
      for (const key of addressKeys) {
        const addr = impOrder[key];
        if (addr == null) {
          continue;
        }
        if (typeof addr !== "object" || Array.isArray(addr)) {
          throw new Error(
            `ImpOrder.${key} must be an object when provided.`,
          );
        }
        const name = addr.Name;
        if (name == null || String(name).trim() === "") {
          throw new Error(
            `ImpOrder.${key}.Name is required when ${key} is included.`,
          );
        }
      }
    },
  },
  async run({ $ }) {
    const {
      entity,
      dateFormatOpt,
      dateDelim,
      savedSchemaId,
      savedSchemaCode,
      impOrder,
    } = this;

    this.validateImpOrder(impOrder);

    const body = {
      Entity: entity,
      DateFormatOpt: dateFormatOpt || "A",
      DateDelim: dateDelim || "-",
      ImpOrder: impOrder,
      ...orderReturnSchema,
    };

    if (savedSchemaId) {
      body.SavedSchemaID = savedSchemaId;
    }
    if (savedSchemaCode) {
      body.SavedSchemaCode = savedSchemaCode;
    }

    const data = await this.app.postExport({
      $,
      endpoint: "/documents/orderupload/export.json",
      data: body,
    });

    $.export("$summary", "Order upload request completed");
    return data;
  },
};
