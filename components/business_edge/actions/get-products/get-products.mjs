import app from "../../business_edge.app.mjs";
import { productReturnSchema } from "../../common/productReturnSchema.mjs";
import { normalizeDateFormatOpt } from "../../common/dateFormat.mjs";
import { isChooseOneObject } from "../../common/propUtils.mjs";

export default {
  key: "business_edge-get-products",
  name: "Get Products",
  description:
    "Retrieve products from Business Edge via `POST /masterfiles/productV3/export.json`. [API index](https://hangerbolt.ci-inc.com/apilist/export)",
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
    branchCode: {
      type: "string",
      label: "Branch Code (BranchCode)",
      description: "Optional branch code filter for the product export",
      optional: true,
    },
    branchId: {
      type: "string",
      label: "Branch ID (BranchID)",
      description: "Optional branch ID filter for the product export",
      optional: true,
    },
    availBom: {
      type: "boolean",
      label: "Include Bill of Materials in Available (AvailBOM)",
      description: "When true, include bill of materials in availability data",
      optional: true,
      default: false,
    },
    chooseOne: {
      type: "object",
      label: "Choose One (ChooseOne)",
      description:
        "Search, Range, or List per API (Range wins over list over search). Example: `{ \"Search\": \"bolt\" }`",
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
      branchCode,
      branchId,
      availBom,
      chooseOne,
    } = this;

    const fmt = normalizeDateFormatOpt(dateFormatOpt);
    const body = {
      Entity: entity,
      DateFormatOpt: fmt,
      ...productReturnSchema,
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
    if (branchCode) {
      body.BranchCode = branchCode;
    }
    if (branchId) {
      body.BranchID = branchId;
    }
    if (availBom !== undefined) {
      body.AvailBOM = availBom;
    }
    if (isChooseOneObject(chooseOne)) {
      body.ChooseOne = chooseOne;
    }

    const data = await this.app.postExport({
      $,
      endpoint: "/masterfiles/productV3/export.json",
      data: body,
    });

    const products = Array.isArray(data?.Product)
      ? data.Product
      : [];
    $.export(
      "$summary",
      `Successfully retrieved ${products.length} products`,
    );
    return data;
  },
};
