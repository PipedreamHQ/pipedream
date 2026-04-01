import app from "../../business_edge.app.mjs";
import { customerReturnSchema } from "../../common/customerReturnSchema.mjs";

export default {
  key: "business_edge-get-customers",
  name: "Get Customers",
  description:
    "Retrieve customers from Business Edge via `POST /masterfiles/customerV3/export.json`. [API index](https://hangerbolt.ci-inc.com/apilist/export)",
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
        "Send Search, List, and/or Range per API rules (Range overrides search and list). Example: `{ \"Search\": \"ACME\" }` or `{ \"Range\": { \"CustBeg\": \"\", \"CustEnd\": \"\", \"CustSeq\": \"B\" } }`",
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
      availBom,
      chooseOne,
    } = this;

    const body = {
      Entity: entity,
      DateFormatOpt: dateFormatOpt || "A",
      ...customerReturnSchema,
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
    if (availBom !== undefined) {
      body.AvailBOM = availBom;
    }
    if (chooseOne && typeof chooseOne === "object" && Object.keys(chooseOne).length > 0) {
      body.ChooseOne = chooseOne;
    }

    const data = await this.app.postExport({
      $,
      endpoint: "/masterfiles/customerV3/export.json",
      data: body,
    });

    const customers = Array.isArray(data?.Customer)
      ? data.Customer
      : [];
    $.export(
      "$summary",
      `Successfully retrieved ${customers.length} customers`,
    );
    return data;
  },
};
