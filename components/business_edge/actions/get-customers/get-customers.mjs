import app from "../../business_edge.app.mjs";
import { customerReturnSchema } from "../../common/customerReturnSchema.mjs";
import { normalizeDateFormatOpt } from "../../common/dateFormat.mjs";
import { isChooseOneObject } from "../../common/propUtils.mjs";

export default {
  key: "business_edge-get-customers",
  name: "Get Customers",
  description:
    "Retrieve customers from Business Edge via `POST /masterfiles/customerV3/export.json`. [See the documentation](https://hangerbolt.ci-inc.com/apilist/export)",
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
    availBom: {
      propDefinition: [
        app,
        "availBom",
      ],
    },
    chooseOne: {
      propDefinition: [
        app,
        "chooseOne",
      ],
      description:
        "Send Search, List, and/or Range per API rules (Range overrides search and list). Example: `{ \"Search\": \"ACME\" }` or `{ \"Range\": { \"CustBeg\": \"\", \"CustEnd\": \"\", \"CustSeq\": \"B\" } }`",
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

    const fmt = normalizeDateFormatOpt(dateFormatOpt);
    const body = {
      Entity: entity,
      DateFormatOpt: fmt,
      DateDelim: dateDelim,
      SavedSchemaID: savedSchemaId,
      SavedSchemaCode: savedSchemaCode,
      AvailBOM: availBom,
      ...customerReturnSchema,
    };

    if (isChooseOneObject(chooseOne)) {
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
