import app from "../../business_edge.app.mjs";
import { productReturnSchema } from "../../common/productReturnSchema.mjs";

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
    branchCode: {
      type: "string",
      label: "Branch Code (BranchCode)",
      optional: true,
    },
    branchId: {
      type: "string",
      label: "Branch ID (BranchID)",
      optional: true,
    },
    availBom: {
      type: "boolean",
      label: "Include Bill of Materials in Available (AvailBOM)",
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

    const body = {
      Entity: entity,
      DateFormatOpt: dateFormatOpt || "A",
      ...productReturnSchema,
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
    if (branchCode) {
      body.BranchCode = branchCode;
    }
    if (branchId) {
      body.BranchID = branchId;
    }
    if (availBom !== undefined) {
      body.AvailBOM = availBom;
    }
    if (chooseOne && typeof chooseOne === "object" && Object.keys(chooseOne).length > 0) {
      body.ChooseOne = chooseOne;
    }

    const data = await this.app.postExport({
      $,
      endpoint: "/masterfiles/productV3/export.json",
      data: body,
    });

    $.export("$summary", "Retrieved products from Business Edge");
    return data;
  },
};
